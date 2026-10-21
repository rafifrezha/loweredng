import { describe, expect, it } from 'vitest';
import { applyEdits, detectAxle, parseSetting, planFor, scanFile, type Settings } from './jbeam';
import { defaultSettings } from './settings';
import { FRONT, REAR } from './fixtures';

const editsFor = (text: string, axle: 'F' | 'R', settings: Settings) =>
  scanFile(text).flatMap((r) => planFor(r, axle, settings).edits);

describe('scanFile', () => {
  it('reads only range alignment variables and ignores comments and strings', () => {
    const rows = scanFile(FRONT);
    expect(rows.map((r) => r.name)).toEqual([
      '$camber_F',
      '$toe_F',
      '$trackoffset_F',
      '$springheight_F',
      '$toe_F_expr',
    ]);
    expect(rows.map((r) => r.param)).toEqual(['camber', 'toe', 'offset', 'height', 'toe']);
  });

  it('records the exact text span of min and max', () => {
    const camber = scanFile(FRONT)[0];
    expect(FRONT.slice(camber.minSpan!.start, camber.minSpan!.end)).toBe('0.95');
    expect(FRONT.slice(camber.maxSpan!.start, camber.maxSpan!.end)).toBe('1.05');
    expect(camber.defaultValue).toBe(1);
  });

  it('marks a non-numeric min instead of guessing', () => {
    const expr = scanFile(FRONT).find((r) => r.name === '$toe_F_expr')!;
    expect(expr.min).toBeNull();
    expect(expr.minText).toBe('"$base_min"');
  });

  it('handles CRLF line endings', () => {
    expect(scanFile(REAR).map((r) => r.name)[0]).toBe('$camber_R');
  });

  it('finds columns by header name, not position', () => {
    const text = `{"a":{"variables":[["max","min","name","type","default"],[2,1,"$camber_F","range",1.5]]}}`;
    const [row] = scanFile(text);
    expect([row.min, row.max]).toEqual([1, 2]);
  });
});

describe('detectAxle', () => {
  it.each([
    ['vehicles/car/suspension_f.jbeam', 'F'],
    ['vehicles/car/car_suspension_F.jbeam', 'F'],
    ['vehicles/car/suspension_front.jbeam', 'F'],
    ['vehicles/car/suspension_R.jbeam', 'R'],
    ['vehicles/car/car_suspension_rear_sport.jbeam', 'R'],
    ['vehicles/car/suspension_foo.jbeam', null],
    ['vehicles/car/engine.jbeam', null],
  ])('%s -> %s', (path, axle) => {
    expect(detectAxle(path)).toBe(axle);
  });
});

describe('parseSetting', () => {
  it('accepts a decimal comma and treats empty as unchanged', () => {
    expect(parseSetting('0,55')).toBe(0.55);
    expect(parseSetting('  ')).toBeNull();
    expect(parseSetting('abc')).toBeNaN();
  });
});

describe('planFor', () => {
  const rows = scanFile(FRONT);
  const s = defaultSettings();

  it('edits both bounds when both are set', () => {
    const camber = planFor(rows[0], 'F', s);
    expect(camber.status).toBe('ok');
    expect(camber.edits.map((e) => e.text)).toEqual(['0.55', '1.25']);
  });

  it('flags a default outside the new range but still edits', () => {
    const s2 = defaultSettings();
    s2.camber.F = { min: '1.1', max: '1.3' };
    const camber = planFor(rows[0], 'F', s2);
    expect(camber.status).toBe('warn');
    expect(camber.edits).toHaveLength(2);
  });

  it('only edits the bound that has a setting', () => {
    const offset = planFor(rows[2], 'F', s);
    expect(offset.edits.map((e) => e.text)).toEqual(['0.1']);
    expect(offset.status).toBe('ok');
  });

  it('skips when the new min is not below the max', () => {
    const s2 = defaultSettings();
    s2.offset.F = { min: '0.2', max: '' };
    expect(planFor(rows[2], 'F', s2).status).toBe('skip');
  });

  it('skips non-numeric cells and invalid settings', () => {
    expect(planFor(rows[4], 'F', s).status).toBe('skip');
    const s3 = defaultSettings();
    s3.camber.F.min = 'x';
    expect(planFor(rows[0], 'F', s3).status).toBe('skip');
  });
});

describe('applyEdits', () => {
  it('changes only the numbers, byte for byte', () => {
    const out = applyEdits(FRONT, editsFor(FRONT, 'F', defaultSettings()));
    const expected = FRONT.replace('0.95, 1.05', '0.55, 1.25')
      .replace('0.98, 1.02', '0.6, 1.5')
      .replace('-0.02, 0.02', '-0.02, 0.1')
      .replace('0, -0.05, 0.05', '0, -0.5, 0.05');
    expect(out).toBe(expected);
  });

  it('keeps CRLF and is idempotent', () => {
    const once = applyEdits(REAR, editsFor(REAR, 'R', defaultSettings()));
    expect(once.split('\r\n').length).toBe(REAR.split('\r\n').length);
    expect(editsFor(once, 'R', defaultSettings())).toEqual([]);
  });
});
