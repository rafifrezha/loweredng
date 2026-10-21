import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import { applyEdits, planFor } from './jbeam';
import { buildZip, loadMod, NotAZipError, outputName } from './mod';
import { defaultSettings } from './settings';
import { FRONT, REAR } from './fixtures';

const TEXTURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3, 255]);
const INFO = '{"name":"Test car"}';

async function makeMod() {
  const zip = new JSZip();
  zip.file('vehicles/testcar/testcar_suspension_F.jbeam', '﻿' + FRONT);
  zip.file('vehicles/testcar/testcar_suspension_R.jbeam', REAR);
  zip.file('vehicles/testcar/testcar_body.jbeam', '{"body":{"slots":[]}}');
  zip.file('vehicles/testcar/latin1.jbeam', new Uint8Array([0x7b, 0xe9, 0x7d]));
  zip.file('vehicles/testcar/textures/paint.png', TEXTURE);
  zip.file('vehicles/testcar/info.json', INFO);
  return zip.generateAsync({ type: 'uint8array' });
}

describe('loadMod / buildZip', () => {
  it('round-trips: only the suspension files change', async () => {
    const mod = await loadMod(await makeMod());
    expect(mod.jbeamCount).toBe(4);
    expect(mod.unreadable).toEqual(['vehicles/testcar/latin1.jbeam']);
    expect(mod.files.map((f) => [f.path.split('/').pop(), f.axleGuess])).toEqual([
      ['testcar_suspension_F.jbeam', 'F'],
      ['testcar_suspension_R.jbeam', 'R'],
    ]);

    const settings = defaultSettings();
    const edited = new Map<string, string>();
    for (const f of mod.files) {
      const edits = f.rows.flatMap((r) => planFor(r, f.axleGuess!, settings).edits);
      edited.set(f.path, applyEdits(f.text, edits));
    }

    const out = await JSZip.loadAsync(await buildZip(mod, edited, 'uint8array'));
    const names = Object.keys(out.files).filter((n) => !out.files[n].dir).sort();
    expect(names).toEqual(
      Object.keys(mod.zip.files).filter((n) => !mod.zip.files[n].dir).sort(),
    );
    expect(await out.file('vehicles/testcar/textures/paint.png')!.async('uint8array')).toEqual(TEXTURE);
    expect(await out.file('vehicles/testcar/info.json')!.async('string')).toBe(INFO);
    expect(await out.file('vehicles/testcar/latin1.jbeam')!.async('uint8array')).toEqual(
      new Uint8Array([0x7b, 0xe9, 0x7d]),
    );

    const front = new TextDecoder('utf-8', { ignoreBOM: true }).decode(
      await out.file('vehicles/testcar/testcar_suspension_F.jbeam')!.async('uint8array'),
    );
    expect(front.startsWith('﻿')).toBe(true);
    expect(front).toContain('1, 0.55, 1.25, "Camber"');
  });

  it('restores original text for files left out of a later download', async () => {
    const mod = await loadMod(await makeMod());
    const f = mod.files[0];
    await buildZip(mod, new Map([[f.path, 'EDITED']]), 'uint8array');
    const second = await JSZip.loadAsync(await buildZip(mod, new Map(), 'uint8array'));
    const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(
      await second.file(f.path)!.async('uint8array'),
    );
    expect(text).toBe(f.text);
  });

  it('rejects data that is not a zip', async () => {
    await expect(loadMod(new TextEncoder().encode('Rar!'))).rejects.toBeInstanceOf(NotAZipError);
  });

  it('names the output after the input', () => {
    expect(outputName('my_car.ZIP')).toBe('my_car_loweredNG.zip');
  });
});
