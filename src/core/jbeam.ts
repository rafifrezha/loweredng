// JBeam is not valid JSON (comments, trailing commas, missing commas), so this
// module never re-serializes. It locates character spans and edits text in place.

export type Param = 'camber' | 'toe' | 'offset' | 'height';
export type Axle = 'F' | 'R';
export const PARAMS: Param[] = ['camber', 'toe', 'offset', 'height'];

export interface Span {
  start: number;
  end: number;
}

export interface VarRow {
  name: string;
  param: Param;
  defaultValue: number | null;
  min: number | null;
  max: number | null;
  minText: string;
  maxText: string;
  minSpan: Span | null;
  maxSpan: Span | null;
}

type Node =
  | { kind: 'string'; start: number; end: number; value: string }
  | { kind: 'atom'; start: number; end: number; text: string }
  | { kind: 'array'; start: number; end: number; items: Node[] }
  | { kind: 'object'; start: number; end: number; entries: { key: Node; value: Node }[] };

const PLAIN_NUMBER = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;

class Scanner {
  constructor(private s: string) {}

  /** Skips whitespace and comments. Commas count as whitespace when `commas` is set. */
  skip(i: number, commas: boolean): number {
    const s = this.s;
    while (i < s.length) {
      const c = s[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '﻿' || (commas && c === ',')) {
        i++;
      } else if (c === '/' && s[i + 1] === '/') {
        const nl = s.indexOf('\n', i);
        i = nl === -1 ? s.length : nl + 1;
      } else if (c === '/' && s[i + 1] === '*') {
        const close = s.indexOf('*/', i + 2);
        i = close === -1 ? s.length : close + 2;
      } else {
        break;
      }
    }
    return i;
  }

  /** Returns the index just past the closing quote of the string starting at `i`. */
  stringEnd(i: number): number {
    const s = this.s;
    let j = i + 1;
    while (j < s.length) {
      if (s[j] === '\\') j += 2;
      else if (s[j] === '"') return j + 1;
      else j++;
    }
    throw new Error('Unterminated string');
  }

  parse(i: number): Node {
    const s = this.s;
    const c = s[i];
    if (c === '"') {
      const end = this.stringEnd(i);
      const raw = s.slice(i, end);
      let value: string;
      try {
        value = JSON.parse(raw);
      } catch {
        value = raw.slice(1, -1);
      }
      return { kind: 'string', start: i, end, value };
    }
    if (c === '[') {
      const items: Node[] = [];
      let j = i + 1;
      for (;;) {
        j = this.skip(j, true);
        if (j >= s.length) throw new Error('Unterminated array');
        if (s[j] === ']') return { kind: 'array', start: i, end: j + 1, items };
        const item = this.parse(j);
        items.push(item);
        j = item.end;
      }
    }
    if (c === '{') {
      const entries: { key: Node; value: Node }[] = [];
      let j = i + 1;
      for (;;) {
        j = this.skip(j, true);
        if (j >= s.length) throw new Error('Unterminated object');
        if (s[j] === '}') return { kind: 'object', start: i, end: j + 1, entries };
        const key = this.parse(j);
        j = this.skip(key.end, false);
        if (s[j] === ':') j = this.skip(j + 1, false);
        const value = this.parse(j);
        entries.push({ key, value });
        j = value.end;
      }
    }
    let j = i;
    while (j < s.length) {
      const d = s[j];
      if (/[\s,[\]{}:"]/.test(d)) break;
      if (d === '/' && (s[j + 1] === '/' || s[j + 1] === '*')) break;
      j++;
    }
    if (j === i) throw new Error(`Unexpected character at ${i}`);
    return { kind: 'atom', start: i, end: j, text: s.slice(i, j) };
  }
}

function cellText(node: Node | undefined): string | null {
  if (!node) return null;
  if (node.kind === 'string') return node.value;
  if (node.kind === 'atom') return node.text;
  return null;
}

export function paramOf(name: string): Param | null {
  const n = name.replace(/\$/g, '').toLowerCase();
  for (const p of PARAMS) if (n.includes(p)) return p;
  return null;
}

function rowsFromTable(table: Node & { kind: 'array' }, src: string): VarRow[] {
  const out: VarRow[] = [];
  let header: Map<string, number> | null = null;
  for (const item of table.items) {
    if (item.kind !== 'array') continue;
    if (!header) {
      const names = item.items.map(cellText);
      if (item.items.every((n) => n.kind === 'string') && names.includes('name')) {
        header = new Map(names.map((n, idx) => [n as string, idx]));
      }
      continue;
    }
    const col = (key: string) => {
      const idx = header!.get(key);
      return idx === undefined ? undefined : item.items[idx];
    };
    const name = cellText(col('name'));
    if (!name || cellText(col('type')) !== 'range') continue;
    const param = paramOf(name);
    if (!param) continue;

    const numberCell = (node: Node | undefined) =>
      node && node.kind === 'atom' && PLAIN_NUMBER.test(node.text) ? node : null;
    const minNode = numberCell(col('min'));
    const maxNode = numberCell(col('max'));
    const defNode = numberCell(col('default'));
    const rawMin = col('min');
    const rawMax = col('max');

    out.push({
      name,
      param,
      defaultValue: defNode ? Number(defNode.text) : null,
      min: minNode ? Number(minNode.text) : null,
      max: maxNode ? Number(maxNode.text) : null,
      minText: rawMin ? src.slice(rawMin.start, rawMin.end) : '',
      maxText: rawMax ? src.slice(rawMax.start, rawMax.end) : '',
      minSpan: minNode ? { start: minNode.start, end: minNode.end } : null,
      maxSpan: maxNode ? { start: maxNode.start, end: maxNode.end } : null,
    });
  }
  return out;
}

/** Finds every `"variables": [...]` table and returns its alignment rows of type `range`. */
export function scanFile(text: string): VarRow[] {
  const sc = new Scanner(text);
  const rows: VarRow[] = [];
  let i = 0;
  while (i < text.length) {
    i = sc.skip(i, false);
    if (i >= text.length) break;
    if (text[i] !== '"') {
      i++;
      continue;
    }
    let end: number;
    try {
      end = sc.stringEnd(i);
    } catch {
      break;
    }
    if (text.slice(i, end) === '"variables"') {
      let j = sc.skip(end, false);
      if (text[j] === ':') {
        j = sc.skip(j + 1, false);
        if (text[j] === '[') {
          try {
            const table = sc.parse(j);
            if (table.kind === 'array') rows.push(...rowsFromTable(table, text));
            i = table.end;
            continue;
          } catch {
            // Malformed table: keep scanning after the key.
          }
        }
      }
    }
    i = end;
  }
  return rows;
}

/** Guesses the axle from the file name: suspension_f / suspension_front, suspension_r / suspension_rear. */
export function detectAxle(path: string): Axle | null {
  const base = path.split('/').pop()!.toLowerCase();
  if (/suspension_(front|f)(?![a-z])/.test(base)) return 'F';
  if (/suspension_(rear|r)(?![a-z])/.test(base)) return 'R';
  return null;
}

export interface Bound {
  min: string;
  max: string;
}
export type Settings = Record<Param, Record<Axle, Bound>>;

/** Empty means "leave as is". Accepts a decimal comma. Returns NaN for anything else. */
export function parseSetting(input: string): number | null {
  const t = input.trim().replace(',', '.');
  if (t === '') return null;
  return PLAIN_NUMBER.test(t) ? Number(t) : NaN;
}

export type Status = 'ok' | 'warn' | 'same' | 'skip';

export interface Edit {
  start: number;
  end: number;
  text: string;
}

export interface Plan {
  status: Status;
  reason: string;
  newMin: number | null;
  newMax: number | null;
  edits: Edit[];
}

export function planFor(row: VarRow, axle: Axle, settings: Settings): Plan {
  const bound = settings[row.param][axle];
  const sMin = parseSetting(bound.min);
  const sMax = parseSetting(bound.max);
  const plan = (status: Status, reason: string, edits: Edit[] = []): Plan => ({
    status,
    reason,
    newMin: sMin ?? row.min,
    newMax: sMax ?? row.max,
    edits,
  });

  if (Number.isNaN(sMin) || Number.isNaN(sMax)) return plan('skip', 'Setting is not a number');
  if (sMin === null && sMax === null) return plan('same', 'No setting for this parameter');
  if (row.min === null || row.max === null || !row.minSpan || !row.maxSpan) {
    return plan('skip', 'Min or max in the file is not a plain number');
  }
  const newMin = sMin ?? row.min;
  const newMax = sMax ?? row.max;
  if (newMin >= newMax) return plan('skip', `New min ${newMin} is not below max ${newMax}`);

  const edits: Edit[] = [];
  if (sMin !== null && sMin !== row.min) edits.push({ ...row.minSpan, text: String(sMin) });
  if (sMax !== null && sMax !== row.max) edits.push({ ...row.maxSpan, text: String(sMax) });
  if (edits.length === 0) return plan('same', 'Already matches the setting');

  const d = row.defaultValue;
  if (d !== null && (d < newMin || d > newMax)) {
    return plan('warn', `Default ${d} falls outside the new range`, edits);
  }
  return plan('ok', 'Range changes', edits);
}

/** Applies edits back to front so earlier offsets stay valid. */
export function applyEdits(text: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  for (let k = 1; k < sorted.length; k++) {
    if (sorted[k].end > sorted[k - 1].start) throw new Error('Overlapping edits');
  }
  let out = text;
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}
