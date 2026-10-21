export type BuildState =
  | { kind: 'idle' }
  | { kind: 'building'; percent: number }
  | { kind: 'done'; name: string }
  | { kind: 'error'; message: string };

interface Props {
  editCount: number;
  fileCount: number;
  blockedReason: string | null;
  build: BuildState;
  onDownload: () => void;
}

export function DownloadBar({ editCount, fileCount, blockedReason, build, onDownload }: Props) {
  let message: string;
  if (build.kind === 'building') message = `Building zip, ${Math.round(build.percent)}%`;
  else if (build.kind === 'error') message = build.message;
  else if (blockedReason) message = blockedReason;
  else {
    message = `${editCount} ${editCount === 1 ? 'number' : 'numbers'} in ${fileCount} ${fileCount === 1 ? 'file' : 'files'} will change.`;
    if (build.kind === 'done') message += ` Saved as ${build.name}.`;
  }

  const progress = build.kind === 'building' ? build.percent / 100 : build.kind === 'done' ? 1 : 0;

  return (
    <div className="download-bar">
      <span
        className={`download-progress${build.kind === 'done' ? ' is-done' : ''}`}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <div className="download-inner">
        <p className={`download-msg${build.kind === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">
          {message}
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled={blockedReason !== null || build.kind === 'building'}
          onClick={onDownload}
        >
          Download zip
        </button>
      </div>
    </div>
  );
}
