import JSZip from 'jszip';
import { detectAxle, scanFile, type Axle, type VarRow } from './jbeam';

export interface ModFile {
  path: string;
  axleGuess: Axle | null;
  text: string;
  rows: VarRow[];
}

export interface LoadedMod {
  zip: JSZip;
  files: ModFile[];
  jbeamCount: number;
  /** jbeam files that are not valid UTF-8 and were left untouched. */
  unreadable: string[];
}

export class NotAZipError extends Error {}

export async function loadMod(data: ArrayBuffer | Uint8Array | Blob): Promise<LoadedMod> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(data);
  } catch (err) {
    throw new NotAZipError(err instanceof Error ? err.message : String(err));
  }

  const files: ModFile[] = [];
  const unreadable: string[] = [];
  let jbeamCount = 0;
  // fatal: refuse to guess at non-UTF-8 bytes. ignoreBOM: keep a BOM so it survives the round trip.
  const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

  for (const entry of Object.values(zip.files)) {
    if (entry.dir || !/\.jbeam$/i.test(entry.name)) continue;
    jbeamCount++;
    const bytes = await entry.async('uint8array');
    let text: string;
    try {
      text = decoder.decode(bytes);
    } catch {
      unreadable.push(entry.name);
      continue;
    }
    const rows = scanFile(text);
    if (rows.length > 0) {
      files.push({ path: entry.name, axleGuess: detectAxle(entry.name), text, rows });
    }
  }

  files.sort((a, b) => a.path.localeCompare(b.path));
  return { zip, files, jbeamCount, unreadable };
}

/**
 * Writes every scanned file back: the edited text when one is given, the
 * original text otherwise. That way a second download with a different
 * selection never carries leftovers from the first.
 */
export async function buildZip<T extends 'uint8array' | 'blob'>(
  mod: LoadedMod,
  edited: Map<string, string>,
  type: T,
  onProgress?: (percent: number) => void,
): Promise<T extends 'blob' ? Blob : Uint8Array> {
  const encoder = new TextEncoder();
  for (const f of mod.files) {
    const entry = mod.zip.files[f.path];
    mod.zip.file(f.path, encoder.encode(edited.get(f.path) ?? f.text), {
      date: entry.date,
      unixPermissions: entry.unixPermissions,
      dosPermissions: entry.dosPermissions,
    });
  }
  const out = await mod.zip.generateAsync(
    { type, compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (meta) => onProgress?.(meta.percent),
  );
  return out as T extends 'blob' ? Blob : Uint8Array;
}

export function outputName(zipName: string): string {
  return `${zipName.replace(/\.zip$/i, '')}_loweredNG.zip`;
}
