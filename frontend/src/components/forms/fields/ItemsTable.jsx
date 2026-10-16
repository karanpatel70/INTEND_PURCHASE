import Icon from '../../ui/Icon.jsx';
import Button from '../../ui/Button.jsx';
import { itemsTotal } from '@shared/calculators.js';
import { inr } from '../../../utils/format.js';

// A table of rows (description, qty, rate) with totals. Used for the items in the indent and in the PO.
// Two looks: the tax % is typed under the table (field.taxEditable not false), or comes from another field (the PO).
const blank = () => ({ desc: '', qty: '', rate: '' });

export default function ItemsTable({ field, value, values, onChange, error, readOnly, className }) {
  const rows = value && value.length ? value : [blank()];
  const tax = values[field.taxField] ?? field.defaultTax ?? 0;
  const { subtotal, tax: taxAmount, total } = itemsTotal(rows, tax);
  const editableTax = field.taxEditable !== false;

  const setRows = (next) => onChange(field.name, next);
  const edit = (k, col, v) => setRows(rows.map((r, x) => (x === k ? { ...r, [col]: v } : r)));
  const remove = (k) => rows.length > 1 && setRows(rows.filter((_, x) => x !== k));
  const add = () => setRows([...rows, field.name === 'items' && !editableTax ? { desc: '', qty: 1, rate: 0 } : blank()]);

  const cell = (r, k, col, props = {}) => (
    <input className="inp" value={r[col] ?? ''} disabled={readOnly} onChange={(e) => edit(k, col, e.target.value)} {...props} />
  );

  return (
    <div className={`field ${error ? 'bad' : ''} ${className}`}>
      <label className={`lbl ${field.required ? 'req' : ''}`}>{field.label}</label>

      {editableTax ? (
        <div className="tablewrap">
          <table className="itemtbl">
            <thead>
              <tr><th style={{ width: 40 }}>#</th><th>Description</th><th style={{ width: 80 }}>Qty</th><th style={{ width: 130 }}>Rate (₹)</th><th style={{ width: 130, textAlign: 'right' }}>Amount</th><th style={{ width: 40 }} /></tr>
            </thead>
            <tbody>
              {rows.map((r, k) => (
                <tr key={k}>
                  <td className="muted">{k + 1}</td>
                  <td>{cell(r, k, 'desc', { placeholder: 'Description' })}</td>
                  <td>{cell(r, k, 'qty', { type: 'number', min: 1 })}</td>
                  <td>{cell(r, k, 'rate', { type: 'number', min: 0 })}</td>
                  <td className="tnum" style={{ textAlign: 'right' }}>{inr((Number(r.qty) || 0) * (Number(r.rate) || 0))}</td>
                  <td>{!readOnly && <Button variant="sec" size="sm" icon="x" onClick={() => remove(k)} aria-label="Remove item" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="items">
          <thead>
            <tr><th>S. no.</th><th>Description</th><th>Qty</th><th>Unit price (₹)</th><th className="r">Amount</th><th /></tr>
          </thead>
          <tbody>
            {rows.map((r, k) => (
              <tr key={k}>
                <td className="muted">{k + 1}</td>
                <td>{cell(r, k, 'desc', { placeholder: 'Description' })}</td>
                <td>{cell(r, k, 'qty', { type: 'number', min: 0, step: 'any', style: { width: 80 } })}</td>
                <td>{cell(r, k, 'rate', { type: 'number', min: 0, step: 'any', style: { width: 115 } })}</td>
                <td className="r tnum">{inr((Number(r.qty) || 0) * (Number(r.rate) || 0))}</td>
                <td>{!readOnly && <Button variant="sec" size="sm" icon="x" onClick={() => remove(k)} aria-label="Remove item" />}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={4} className="r">Sub total</td><td className="r tnum">{inr(subtotal)}</td><td /></tr>
            <tr><td colSpan={4} className="r">{field.taxLabel || 'Tax'}</td><td className="r tnum">{inr(taxAmount)}</td><td /></tr>
            <tr><td colSpan={4} className="r">Total</td><td className="r tnum">{inr(total)}</td><td /></tr>
          </tfoot>
        </table>
      )}

      {!readOnly && <div style={{ marginTop: 8 }}><Button variant="sec" size="sm" icon="plus" onClick={add}>Add item</Button></div>}
      <div className="err">{error}</div>

      {editableTax && (
        <div className="totals">
          <div><span>Subtotal</span><span className="tnum">{inr(subtotal)}</span></div>
          <div>
            <span>
              Tax @{' '}
              <input
                className="inp" type="number" min="0" disabled={readOnly} value={tax}
                style={{ width: 62, padding: '3px 6px', display: 'inline-block' }}
                onChange={(e) => onChange(field.taxField, e.target.value)}
              />{' '}%
            </span>
            <span className="tnum">{inr(taxAmount)}</span>
          </div>
          <div className="gt"><span>Total</span><span className="tnum">{inr(total)}</span></div>
        </div>
      )}
    </div>
  );
}
