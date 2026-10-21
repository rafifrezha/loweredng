import { PARAMS, type Axle, type Param, type Settings } from '../core/jbeam';

export const PARAM_LABEL: Record<Param, string> = {
  camber: 'Camber',
  toe: 'Toe',
  offset: 'Offset',
  height: 'Ride height',
};
export const AXLE_LABEL: Record<Axle, string> = { F: 'Front', R: 'Rear' };

const COLUMNS: { axle: Axle; bound: 'min' | 'max' }[] = [
  { axle: 'F', bound: 'min' },
  { axle: 'F', bound: 'max' },
  { axle: 'R', bound: 'min' },
  { axle: 'R', bound: 'max' },
];

interface Props {
  settings: Settings;
  invalid: Set<string>;
  onChange: (param: Param, axle: Axle, bound: 'min' | 'max', value: string) => void;
  onReset: () => void;
}

export const fieldKey = (p: Param, a: Axle, b: 'min' | 'max') => `${p}.${a}.${b}`;

export function SettingsGrid({ settings, invalid, onChange, onReset }: Props) {
  const errors = PARAMS.flatMap((p) =>
    COLUMNS.filter((c) => invalid.has(fieldKey(p, c.axle, c.bound))).map(
      (c) => `${PARAM_LABEL[p]}, ${AXLE_LABEL[c.axle].toLowerCase()} ${c.bound}: "${settings[p][c.axle][c.bound]}" is not a number.`,
    ),
  );

  return (
    <section className="block work" aria-labelledby="settings-h">
      <h2 id="settings-h">New limits</h2>
      <p className="lead">
        The starting values come from the project notes and have not been checked in game. Compare them
        with the Current column in the preview. An empty field keeps the file's value. A decimal comma
        works too.
      </p>
      <div className="settings-wrap">
        <table className="settings">
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              {COLUMNS.map((c) => (
                <th scope="col" key={`${c.axle}${c.bound}`}>
                  {AXLE_LABEL[c.axle]} {c.bound}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PARAMS.map((p) => (
              <tr key={p}>
                <th scope="row">{PARAM_LABEL[p]}</th>
                {COLUMNS.map((c) => {
                  const key = fieldKey(p, c.axle, c.bound);
                  const bad = invalid.has(key);
                  return (
                    <td key={key} data-label={`${AXLE_LABEL[c.axle]} ${c.bound}`}>
                      <input
                        className="num-input"
                        inputMode="decimal"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="keep"
                        aria-label={`${PARAM_LABEL[p]} ${AXLE_LABEL[c.axle].toLowerCase()} ${c.bound}`}
                        aria-invalid={bad}
                        aria-describedby={bad ? 'settings-errors' : undefined}
                        value={settings[p][c.axle][c.bound]}
                        onChange={(e) => onChange(p, c.axle, c.bound, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="settings-errors" role="status" className="errors">
        {errors.map((e) => (
          <p key={e}>{e}</p>
        ))}
      </div>
      <button type="button" className="btn-text" onClick={onReset}>
        Restore starting values
      </button>
    </section>
  );
}
