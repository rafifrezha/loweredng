import { useEffect, useRef } from 'react';
import type { Axle, Plan, VarRow } from '../core/jbeam';
import { AXLE_LABEL } from './SettingsGrid';

export interface PreviewRow {
  key: string;
  file: string;
  axle: Axle;
  row: VarRow;
  plan: Plan;
}

const STATUS_LABEL = { ok: 'Will change', warn: 'Check default', same: 'No change', skip: 'Skipped' } as const;

const fmt = (n: number | null, raw: string) => (n === null ? raw : String(n));

interface Props {
  rows: PreviewRow[];
  deselected: Set<string>;
  allSkipped: boolean;
  onToggle: (key: string) => void;
  onToggleAll: (include: boolean) => void;
}

export function PreviewTable({ rows, deselected, allSkipped, onToggle, onToggleAll }: Props) {
  const changeable = rows.filter((r) => r.plan.edits.length > 0);
  const included = changeable.filter((r) => !deselected.has(r.key)).length;
  const all = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (all.current) all.current.indeterminate = included > 0 && included < changeable.length;
  }, [included, changeable.length]);

  return (
    <section className="block work" aria-labelledby="preview-h">
      <h2 id="preview-h">Preview</h2>
      {allSkipped ? (
        <p className="empty">
          Every file is set to Skip. Pick Front or Rear under Suspension files to see what would change.
        </p>
      ) : (
        <>
          <p className="lead">
            Untick a row to leave that variable as it is. Rows marked Check default still change, but the
            car's default value sits outside the new range.
          </p>
          <div className="preview-wrap">
            <table className="preview">
              <thead>
                <tr>
                  <th scope="col" className="col-check">
                    <input
                      ref={all}
                      type="checkbox"
                      aria-label="Include every row that can change"
                      disabled={changeable.length === 0}
                      checked={changeable.length > 0 && included === changeable.length}
                      onChange={(e) => onToggleAll(e.target.checked)}
                    />
                  </th>
                  <th scope="col">Variable</th>
                  <th scope="col">Axle</th>
                  <th scope="col" className="num">Current</th>
                  <th scope="col" className="num">New</th>
                  <th scope="col" className="num">Default</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ key, file, axle, row, plan }) => {
                  const canChange = plan.edits.length > 0;
                  const minChanged = canChange && plan.newMin !== row.min;
                  const maxChanged = canChange && plan.newMax !== row.max;
                  return (
                    <tr key={key} className={canChange && deselected.has(key) ? 'is-off' : undefined}>
                      <td className="col-check">
                        <input
                          type="checkbox"
                          aria-label={`Change ${row.name} in ${file}`}
                          disabled={!canChange}
                          checked={canChange && !deselected.has(key)}
                          onChange={() => onToggle(key)}
                        />
                      </td>
                      <td data-label="Variable">
                        <span className="var-name">{row.name}</span>
                        <span className="var-file">{file.split('/').pop()}</span>
                      </td>
                      <td data-label="Axle">{AXLE_LABEL[axle]}</td>
                      <td data-label="Current" className="num">
                        {fmt(row.min, row.minText)} / {fmt(row.max, row.maxText)}
                      </td>
                      <td data-label="New" className="num">
                        {canChange ? (
                          <>
                            <span className={minChanged ? 'changed' : undefined}>{fmt(plan.newMin, row.minText)}</span>
                            {' / '}
                            <span className={maxChanged ? 'changed' : undefined}>{fmt(plan.newMax, row.maxText)}</span>
                          </>
                        ) : (
                          <span className="dim">unchanged</span>
                        )}
                      </td>
                      <td data-label="Default" className="num">
                        {row.defaultValue ?? '-'}
                      </td>
                      <td data-label="Status">
                        <span className={`status status-${plan.status}`}>{STATUS_LABEL[plan.status]}</span>
                        {plan.status !== 'ok' && <span className="status-reason">{plan.reason}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
