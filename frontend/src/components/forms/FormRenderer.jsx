import { useEffect, useRef } from 'react';
import { fieldRegistry } from './fieldRegistry.js';
import { isVisible } from '@shared/rules.js';
import { calculators, itemsTotal } from '@shared/calculators.js';
import { inr, fmt } from '../../utils/format.js';
import Icon from '../ui/Icon.jsx';
import { Chip } from '../ui/StatusChip.jsx';

// The starting answers of a section: each field's "default" (or empty).
// A default like "@userName" means "use the calculator called userName" (see shared/calculators.js).
export function initialValues(section, ctx) {
  const values = {};
  section.fields.forEach((f) => {
    if (f.type === 'display') return;
    let v = f.default;
    if (typeof v === 'string' && v.startsWith('@')) v = calculators[v.slice(1)]({}, ctx);
    if (v === undefined) {
      v = f.type === 'checkboxes' || f.type === 'file' ? [] : f.type === 'checkbox' ? false : f.type === 'items-table' ? [{ desc: '', qty: '', rate: '' }] : '';
    }
    values[f.name] = v;
    if (f.type === 'items-table' && f.defaultTax !== undefined) values[f.taxField] = f.defaultTax;
  });
  return values;
}

// Owner: Rahul. THE key component. It draws ONE section of ANY form from its JSON template.
//
// props
//   template     the form (from GET /forms/:code)
//   sectionKey   which section to draw, e.g. "indenter", "accounts"
//   values       the answers so far { fieldName: value }
//   onChange     onChange(fieldName, newValue)
//   errors       { fieldName: 'error text' }
//   state        "edit" (default) | "locked" (greyed out, with a note) | "editing" (highlighted: you are filling this)
//   lockNote     text after "Locked ·"
//   numberStart  number shown on the first card (Create indent numbers its cards 1, 2, 3 ...)
//   ctx          { user, lists } used by dropdowns and calculators
const WIDTH = { half: 'fw-half', third: 'fw-third', full: 'fw-full' };

export default function FormRenderer({ template, sectionKey, values, onChange, errors = {}, state = 'edit', lockNote, numberStart, ctx }) {
  const section = template.sections.find((s) => s.key === sectionKey);
  const readOnly = state === 'locked';

  // Some fields are worked out from others (field.calc + field.calcInputs), e.g. "Positively by" from the delivery period.
  const last = useRef({});
  useEffect(() => {
    if (readOnly) return;
    section.fields.forEach((f) => {
      if (!f.calc || !f.calcInputs) return;
      const signature = f.calcInputs.map((n) => values[n]).join('|');
      const first = last.current[f.name] === undefined;
      if (last.current[f.name] === signature) return;
      last.current[f.name] = signature;
      if (first) return; // the starting answers are already right
      const next = calculators[f.calc](values, ctx);
      if (next !== undefined && next !== values[f.name]) onChange(f.name, next);
    });
  });

  // a field changed by the user: also set the fields it says it resets (field.onEdit)
  function handleChange(name, value) {
    onChange(name, value);
    const f = section.fields.find((x) => x.name === name);
    if (f && f.onEdit) Object.entries(f.onEdit).forEach(([other, v]) => onChange(other, v));
  }

  // fields that share a "group" are drawn together in one numbered card
  const blocks = [];
  section.fields.forEach((f) => {
    const title = f.group || section.title;
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.title === title) lastBlock.fields.push(f);
    else blocks.push({ title, fields: [f] });
  });

  return blocks.map((block, n) => (
    <div key={block.title} className={`card sec ${section.tone || ''} ${state === 'locked' ? 'lockd' : state === 'editing' ? 'editing' : ''} fsec`}>
      <div className="sh">
        <span>
          {numberStart !== undefined && (
            <span className="num" style={state === 'locked' ? { background: '#8A96A8' } : undefined}>{numberStart + n}</span>
          )}
          {block.title}
        </span>
        {state === 'locked' && <span className="lockchip"><Icon name="lock" size={13} />Locked{lockNote ? ' · ' + lockNote : ''}</span>}
        {state === 'editing' && <span className="chip c-amber">You are editing this section</span>}
      </div>
      <div className="sb">
        <div className="fgrid">
          {block.fields.filter((f) => isVisible(f, values)).map((f) => {
            const Component = fieldRegistry[f.type] || fieldRegistry.text;
            return (
              <Component
                key={f.name} field={f} values={values} value={values[f.name]} onChange={handleChange}
                error={errors[f.name]} readOnly={readOnly} ctx={ctx} className={WIDTH[f.width] || 'fw-half'}
              />
            );
          })}
        </div>
      </div>
    </div>
  ));
}


// ---------- the read-only look, used on the indent page ----------
// Shows ONE section of a saved indent as plain text (no inputs).
//   section   one entry of template.sections
//   values    the saved answers of that section, or null if nobody filled it yet
//   indent    the full indent (needed for the signature boxes and names)
//   extra     more rows to add at the end: [[label, value, full?], ...]
//   chip      optional replacement for the "Filled / Not filled" chip in the header

function KV({ items }) {
  return (
    <div className="kv">
      {items.map(([label, value, full]) => (
        <div key={label} className={full ? 'full' : ''}><span>{label}</span><b>{value || <span>Not provided</span>}</b></div>
      ))}
    </div>
  );
}

function SignBox({ label, sign, empty = 'Not signed yet', person }) {
  if (!sign) return <div className="sign"><span>{label}</span><i>{empty}</i></div>;
  return <div className="sign ok"><span>{label}</span><b>{person(sign.pid).name}</b><i>Signed {fmt(sign.t)}</i></div>;
}

const lookup = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);

function showValue(field, values, ctx) {
  const v = values[field.name];
  if (field.type === 'display') return calculators[field.calc](values, ctx);
  if (field.type === 'checkboxes') return (v || []).join(', ');
  if (field.type === 'checkbox') return v ? 'Yes' : 'No';
  if (v === undefined || v === '' || v === null) return '';
  if (field.format === 'inr') return inr(v);
  if (field.type === 'date') return String(v).split('-').reverse().join('.');
  return String(v);
}

export function SectionView({ section, values, indent, extra = [], chip, ctx }) {
  const person = (id) => indent.people[id] || { name: '' };
  const fillable = section.filledBy !== 'indenter' && section.filledBy !== 'none';
  const table = section.fields.find((f) => f.type === 'items-table' && !f.hideInView);

  // signature of "indenter" = the first thing in the history
  const signOf = (path) =>
    path === 'indenter' ? (indent.history[0] ? { pid: indent.by, t: indent.history[0].t } : null) : lookup(indent, path);
  const slots = section.signSlots || [];

  const rows = values
    ? section.fields
        .filter((f) => f.type !== 'items-table' && f.type !== 'file' && !f.hideInView && isVisible(f, values))
        .map((f) => [f.label.length > 60 ? f.name : f.label, showValue(f, values, ctx), f.type === 'textarea'])
    : [];
  if (values && fillable && values.by) rows.push(['Filled by', person(values.by).name]);

  return (
    <div className={`card sec ${section.tone} mb16`}>
      <div className="sh">
        {section.title}{' '}
        {chip || (fillable && (values ? <Chip tone="green">Filled</Chip> : <Chip tone="gray">Not filled</Chip>))}
      </div>
      <div className="sb">
        {values ? rows.length + extra.length > 0 && <KV items={[...rows, ...extra]} /> : fillable && <div className="muted">{section.emptyText}</div>}

        {values && table && (
          <table className="items">
            <thead>
              <tr><th>S. no.</th><th>Description</th><th className="r">Qty</th><th className="r">Rate</th><th className="r">Amount</th></tr>
            </thead>
            <tbody>
              {(values[table.name] || []).map((r, k) => (
                <tr key={k}>
                  <td>{k + 1}</td><td>{r.desc}</td><td className="r">{r.qty}</td>
                  <td className="r tnum">{inr(r.rate)}</td><td className="r tnum">{inr(r.qty * r.rate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {(() => {
                const t = itemsTotal(values[table.name], values[table.taxField]);
                return (
                  <>
                    <tr><td colSpan={4} className="r">Tax @ {values[table.taxField]}%</td><td className="r tnum">{inr(t.tax)}</td></tr>
                    <tr><td colSpan={4} className="r">Total</td><td className="r tnum">{inr(t.total)}</td></tr>
                  </>
                );
              })()}
            </tfoot>
          </table>
        )}

        {slots.length > 0 && (
          <div className="signs" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
            {slots.map((s) => (
              <SignBox
                key={s.path} label={s.label} sign={signOf(s.path)} person={person}
                empty={s.emptyIfRejected && indent.stage === 'REJECTED' ? s.emptyIfRejected : s.empty}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
