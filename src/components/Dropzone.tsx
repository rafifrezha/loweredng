import { useRef, useState, type DragEvent } from 'react';

interface Props {
  busy: boolean;
  loadedName: string | null;
  summary: string | null;
  onFile: (file: File) => void;
}

export function Dropzone({ busy, loadedName, summary, onFile }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files[0];
    if (file && !busy) onFile(file);
  };

  return (
    <div
      className={`dropzone${over ? ' is-over' : ''}${loadedName ? ' is-loaded' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        ref={input}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      {loadedName ? (
        <div className="dropzone-text">
          <p className="dropzone-title">{loadedName}</p>
          {summary && <p className="dropzone-hint">{summary}</p>}
        </div>
      ) : (
        <div className="dropzone-text">
          <p className="dropzone-title">Drop a mod .zip here</p>
          <p className="dropzone-hint">The zip is read in this browser. Nothing is uploaded.</p>
        </div>
      )}
      <button type="button" className="btn btn-outline" disabled={busy} onClick={() => input.current?.click()}>
        {loadedName ? 'Choose another zip' : 'Choose zip'}
      </button>
    </div>
  );
}
