import { isVisible } from '@shared/rules.js';
import { itemsTotal } from '@shared/calculators.js';
import { inr, dstr } from '../../utils/format.js';

// Owner: Rahul. A plain printable record built from the form template and the saved answers.
// It works for EVERY form, so a new form can be printed before anyone designs a special layout.
const text = (f, v) => {
  if (Array.isArray(v) && f.type === 'checkboxes') return v.join(', ');
  if (f.type === 'checkbox') return v ? 'Yes' : 'No';
  if (f.format === 'inr') return inr(v);
  if (f.type === 'date') return dstr(v);
  return v ?? '';
};

export default function GenericPrint({ template, indent }) {
  return (
    <div className="record">
      <h2>{template.name}</h2>
      <p style={{ textAlign: 'center' }}>File No. {indent.no} · {indent.people[indent.by].name}</p>
      {template.sections.filter((s) => s.fields.length && indent.data[s.key]).map((s) => {
        const values = indent.data[s.key];
        return (
          <div key={s.key}>
            <h3 style={{ margin: '18px 0 6px' }}>{s.title}</h3>
            <table>
              <tbody>
                {s.fields.filter((f) => f.type !== 'display' && f.type !== 'file' && isVisible(f, values)).map((f) =>
                  f.type === 'items-table' ? (
                    <tr key={f.name}>
                      <th>{f.label}</th>
                      <td>{(values[f.name] || []).map((r, k) => <div key={k}>{k + 1}. {r.desc} x {r.qty} @ {inr(r.rate)}</div>)}</td>
                    </tr>
                  ) : (
                    <tr key={f.name}><th style={{ width: '40%' }}>{f.label}</th><td>{text(f, values[f.name])}</td></tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

// The purchase order letter (used when the preview page is opened with ?kind=po).
export function PODocument({ indent }) {
  const po = indent.data.po;
  const { subtotal, tax, total } = itemsTotal(po.items || [], po.gstPct || 0);
  return (
    <div className="record">
      <h2>Indian Institute of Technology Ropar</h2>
      <p style={{ textAlign: 'center' }}>Purchase order {indent.po ? '· ' + indent.po : ''}</p>
      <table>
        <tbody>
          <tr><th style={{ width: '30%' }}>Reference</th><td>{po.ref}</td></tr>
          <tr><th>Date</th><td>{dstr(po.date)}</td></tr>
          <tr><th>Supplier</th><td>{po.vendor}<div style={{ whiteSpace: 'pre-line' }}>{po.vendorAddr}</div></td></tr>
          <tr><th>Subject</th><td>{po.subject}</td></tr>
          <tr><th>Deliver to</th><td>{po.deliverTo}</td></tr>
          <tr><th>Deliver by</th><td>{dstr(po.byDate)} ({po.deliveryBy})</td></tr>
          <tr><th>Payment</th><td>{po.payment}</td></tr>
        </tbody>
      </table>
      <h3 style={{ margin: '18px 0 6px' }}>Items</h3>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          {(po.items || []).map((r, k) => (
            <tr key={k}><td>{k + 1}</td><td>{r.desc}</td><td>{r.qty}</td><td>{inr(r.rate)}</td><td>{inr(r.qty * r.rate)}</td></tr>
          ))}
          <tr><td colSpan={4} style={{ textAlign: 'right' }}>Subtotal</td><td>{inr(subtotal)}</td></tr>
          <tr><td colSpan={4} style={{ textAlign: 'right' }}>GST {po.gstPct}%</td><td>{inr(tax)}</td></tr>
          <tr><th colSpan={4} style={{ textAlign: 'right' }}>Total</th><th>{inr(total)}</th></tr>
        </tbody>
      </table>
      {po.terms && <p><b>Terms:</b> {po.terms}</p>}
      {po.std && <p style={{ fontSize: 12.5 }}>{po.std}</p>}
      <p style={{ marginTop: 24 }}>{po.signer}</p>
    </div>
  );
}
