import type { Axle } from '../core/jbeam';
import type { ModFile } from '../core/mod';

export type AxleChoice = Axle | 'skip';

const CHOICES: { value: AxleChoice; label: string }[] = [
  { value: 'F', label: 'Front' },
  { value: 'R', label: 'Rear' },
  { value: 'skip', label: 'Skip' },
];

interface Props {
  files: ModFile[];
  axles: Record<string, AxleChoice>;
  unreadable: string[];
  onChange: (path: string, axle: AxleChoice) => void;
}

export function FileList({ files, axles, unreadable, onChange }: Props) {
  return (
    <section className="block work" aria-labelledby="files-h">
      <h2 id="files-h">Suspension files</h2>
      <p className="lead">
        The axle is guessed from the file name. Change it if the guess is wrong, or skip the file.
      </p>
      <ul className="file-list">
        {files.map((f) => {
          const dir = f.path.slice(0, f.path.lastIndexOf('/') + 1);
          const base = f.path.slice(dir.length);
          return (
            <li key={f.path} className="file-row">
              <div className="file-name">
                <span className="file-dir">{dir}</span>
                <span className="file-base">{base}</span>
                <span className="file-count">
                  {f.rows.length} alignment {f.rows.length === 1 ? 'variable' : 'variables'}
                  {f.axleGuess === null && ', axle not recognised from the name'}
                </span>
              </div>
              <fieldset
                className="segmented"
                style={{ ['--active' as string]: CHOICES.findIndex((c) => c.value === axles[f.path]) }}
              >
                <legend className="sr-only">Axle for {base}</legend>
                <span className="segmented-thumb" aria-hidden="true" />
                {CHOICES.map((c) => (
                  <label key={c.value}>
                    <input
                      type="radio"
                      name={`axle-${f.path}`}
                      value={c.value}
                      checked={axles[f.path] === c.value}
                      onChange={() => onChange(f.path, c.value)}
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </fieldset>
            </li>
          );
        })}
      </ul>
      {unreadable.length > 0 && (
        <p className="note">
          Left unchanged because the text is not UTF-8: {unreadable.join(', ')}
        </p>
      )}
    </section>
  );
}
