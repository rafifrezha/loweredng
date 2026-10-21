import { useMemo, useRef, useState } from 'react';
import { applyEdits, parseSetting, planFor, PARAMS, type Axle, type Param, type Settings } from './core/jbeam';
import { buildZip, loadMod, NotAZipError, outputName, type LoadedMod } from './core/mod';
import { defaultSettings } from './core/settings';
import { Dropzone } from './components/Dropzone';
import { FileList, type AxleChoice } from './components/FileList';
import { fieldKey, SettingsGrid } from './components/SettingsGrid';
import { PreviewTable, type PreviewRow } from './components/PreviewTable';
import { DownloadBar, type BuildState } from './components/DownloadBar';
import { PhotoStrip, PHOTO_BASE } from './components/PhotoStrip';
import { Intro } from './components/Intro';
import { KofiButton } from './components/KofiButton';

type Phase =
  | { kind: 'idle' }
  | { kind: 'reading'; name: string }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; name: string; mod: LoadedMod };

const LOGO = `${import.meta.env.BASE_URL}brand/rfvnx-logo.webp`;

const plural =(n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function loadError(name: string, err: unknown): string {
  if (err instanceof NotAZipError) {
    return `${name} could not be opened as a zip. If it is a .rar or .7z, extract it and zip the folder again.`;
  }
  return `${name} could not be read: ${err instanceof Error ? err.message : String(err)}`;
}

export default function App() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [axles, setAxles] = useState<Record<string, AxleChoice>>({});
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [deselected, setDeselected] = useState<Set<string>>(new Set());
  const [build, setBuild] = useState<BuildState>({ kind: 'idle' });
  const workRef = useRef<HTMLDivElement>(null);

  const openFile = async (file: File) => {
    setPhase({ kind: 'reading', name: file.name });
    setBuild({ kind: 'idle' });
    setDeselected(new Set());
    try {
      const mod = await loadMod(file);
      if (mod.jbeamCount === 0) {
        setPhase({ kind: 'error', message: `${file.name} has no .jbeam files, so there is nothing to change.` });
        return;
      }
      if (mod.files.length === 0) {
        setPhase({
          kind: 'error',
          message: `${file.name} has ${plural(mod.jbeamCount, '.jbeam file')}, but none with camber, toe, offset or height ranges. Mods that only add wheels or a body use the game's own suspension, which this tool cannot change.`,
        });
        return;
      }
      setAxles(Object.fromEntries(mod.files.map((f) => [f.path, f.axleGuess ?? 'skip'])));
      setPhase({ kind: 'ready', name: file.name, mod });
      requestAnimationFrame(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        workRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    } catch (err) {
      setPhase({ kind: 'error', message: loadError(file.name, err) });
    }
  };

  const invalid = useMemo(() => {
    const bad = new Set<string>();
    for (const p of PARAMS)
      for (const a of ['F', 'R'] as Axle[])
        for (const b of ['min', 'max'] as const)
          if (Number.isNaN(parseSetting(settings[p][a][b]))) bad.add(fieldKey(p, a, b));
    return bad;
  }, [settings]);

  const mod = phase.kind === 'ready' ? phase.mod : null;

  const rows = useMemo<PreviewRow[]>(() => {
    if (!mod) return [];
    return mod.files.flatMap((f) => {
      const axle = axles[f.path];
      if (!axle || axle === 'skip') return [];
      return f.rows.map((row, i) => ({
        key: `${f.path}#${i}`,
        file: f.path,
        axle,
        row,
        plan: planFor(row, axle, settings),
      }));
    });
  }, [mod, axles, settings]);

  const chosen = rows.filter((r) => r.plan.edits.length > 0 && !deselected.has(r.key));
  const editCount = chosen.reduce((n, r) => n + r.plan.edits.length, 0);
  const fileCount = new Set(chosen.map((r) => r.file)).size;
  const blockedReason =
    invalid.size > 0
      ? 'Fix the settings that are not numbers first.'
      : editCount === 0
        ? 'Nothing selected to change yet.'
        : null;

  const download = async () => {
    if (phase.kind !== 'ready') return;
    const editsByFile = new Map<string, PreviewRow[]>();
    for (const r of chosen) editsByFile.set(r.file, [...(editsByFile.get(r.file) ?? []), r]);
    const edited = new Map<string, string>();
    for (const f of phase.mod.files) {
      const fileRows = editsByFile.get(f.path);
      if (fileRows) edited.set(f.path, applyEdits(f.text, fileRows.flatMap((r) => r.plan.edits)));
    }

    setBuild({ kind: 'building', percent: 0 });
    try {
      const blob = await buildZip(phase.mod, edited, 'blob', (percent) =>
        setBuild({ kind: 'building', percent }),
      );
      const name = outputName(phase.name);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setBuild({ kind: 'done', name });
    } catch (err) {
      setBuild({
        kind: 'error',
        message: `The zip could not be built (${err instanceof Error ? err.message : String(err)}). Large mods can run the browser out of memory; try a desktop browser.`,
      });
    }
  };

  const setSetting = (p: Param, a: Axle, b: 'min' | 'max', value: string) => {
    setSettings((s) => ({ ...s, [p]: { ...s[p], [a]: { ...s[p][a], [b]: value } } }));
    setBuild({ kind: 'idle' });
  };

  const changeableKeys = rows.filter((r) => r.plan.edits.length > 0).map((r) => r.key);

  return (
    <>
      <Intro />
      <header
        className="hero"
        style={{
          ['--hero-sm' as string]: `url(${PHOTO_BASE}sedan-black-front-industrial-1280.webp)`,
          ['--hero-lg' as string]: `url(${PHOTO_BASE}sedan-black-front-industrial-2400.webp)`,
        }}
      >
        <div className="container">
          <div className="topbar">
            <img
              className="wordmark"
              src={`${import.meta.env.BASE_URL}brand/loweredng-wordmark.webp`}
              width={880}
              height={144}
              alt="loweredNG"
            />
            <a className="maker-link" href="https://ko-fi.com/rfvnx" target="_blank" rel="noopener noreferrer">
              <img className="maker" src={LOGO} width={480} height={209} alt="RFVNX on Ko-fi (opens in a new tab)" />
            </a>
          </div>
          <div className="hero-body">
            <h1>Lower a BeamNG mod without editing jbeam by hand.</h1>
            <p className="hero-sub">
              Set new camber, toe, offset and ride height limits. Only those numbers change in the zip you
              download.
            </p>
            <Dropzone
              busy={phase.kind === 'reading' || build.kind === 'building'}
              loadedName={phase.kind === 'ready' ? phase.name : null}
              summary={phase.kind === 'ready' ? `${plural(phase.mod.files.length, 'suspension file')} found` : null}
              onFile={openFile}
            />
            <div className="hero-status" role="status" aria-live="polite">
              {phase.kind === 'reading' && <p>Reading {phase.name}…</p>}
              {phase.kind === 'error' && <p className="is-error">{phase.message}</p>}
            </div>
          </div>
        </div>
      </header>

      <main className="container" ref={workRef}>
        {phase.kind === 'ready' && (
          <>
            <FileList
              files={phase.mod.files}
              axles={axles}
              unreadable={phase.mod.unreadable}
              onChange={(path, axle) => {
                setAxles((x) => ({ ...x, [path]: axle }));
                setBuild({ kind: 'idle' });
              }}
            />
            <SettingsGrid
              settings={settings}
              invalid={invalid}
              onChange={setSetting}
              onReset={() => {
                setSettings(defaultSettings());
                setBuild({ kind: 'idle' });
              }}
            />
            <PreviewTable
              rows={rows}
              deselected={deselected}
              allSkipped={rows.length === 0}
              onToggle={(key) =>
                setDeselected((d) => {
                  const next = new Set(d);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                })
              }
              onToggleAll={(include) => setDeselected(include ? new Set() : new Set(changeableKeys))}
            />
          </>
        )}

        <PhotoStrip />

        <section className="block limits" aria-labelledby="limits-h">
          <h2 id="limits-h">Before you use it</h2>
          <dl className="notes">
            <div className="note">
              <dt>Your original stays as it is</dt>
              <dd>
                You get a new zip with _loweredNG in its name. Try it in BeamNG.drive before you delete the
                original.
              </dd>
            </div>
            <div className="note">
              <dt>Matched by name</dt>
              <dd>
                Anything containing camber, toe, offset or height. Mods name them differently, so read the
                preview before you download.
              </dd>
            </div>
            <div className="note">
              <dt>Needs a suspension file</dt>
              <dd>Wheel-only and body-only mods use the game's own suspension, so there is nothing to change.</dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="footer">
        <div className="container credit">
          <span>loweredNG by</span>
          <a className="maker-link" href="https://ko-fi.com/rfvnx" target="_blank" rel="noopener noreferrer">
            <img src={LOGO} width={480} height={209} alt="RFVNX on Ko-fi (opens in a new tab)" />
          </a>
        </div>
      </footer>

      <KofiButton raised={phase.kind === 'ready'} />
      {phase.kind === 'ready' && (
        <DownloadBar
          editCount={editCount}
          fileCount={fileCount}
          blockedReason={blockedReason}
          build={build}
          onDownload={download}
        />
      )}
    </>
  );
}
