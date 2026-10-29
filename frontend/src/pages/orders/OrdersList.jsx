import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLists } from '../../hooks/useLists.js';
import { listOrders, extendOrder, deliverOrder, cancelOrder } from '../../api/orders.js';
import { ordInfo } from '@shared/orders.js';
import { dstr, addDays, presetDate, todayStr } from '../../utils/format.js';
import { isPurchase } from '../../utils/roles.js';
import PasswordDialog from '../../components/ui/PasswordDialog.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Field from '../../components/ui/Field.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Rahul. Purchase orders after they are issued: progress, extension, delivery, cancellation.
// Purchase staff see every order and can extend, deliver or cancel. An indenter sees only their own, read-only.
// The three actions are a preview for now: they check the form and show a message.
export default function OrdersList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists] = useLists();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('ongoing');
  const [q, setQ] = useState('');
  const [dialog, setDialog] = useState(null); // { kind: 'extend' | 'deliver', order }
  const [message, setMessage] = useState('');
  const mine = !isPurchase(user);

  useEffect(() => { listOrders(user).then(setOrders); }, [user]);
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };

  const all = orders.map((o) => ({ o, info: ordInfo(o) }));
  const live = (x) => ['prep', 'open', 'over'].includes(x.info.k);
  const ongoing = all.filter(live);
  const finished = all.filter((x) => !live(x));
  const overdue = ongoing.filter((x) => x.info.k === 'over').length;
  const soon = ongoing.filter((x) => x.info.k === 'open' && x.info.left <= 7).length;

  let rows = tab === 'done' ? finished : ongoing;
  const needle = q.trim().toLowerCase();
  if (needle) rows = rows.filter((x) => (x.o.no + x.o.title + (x.o.po || '') + x.o.vendor).toLowerCase().includes(needle));
  rows = [...rows].sort((a, b) => (a.info.k === 'over' ? 0 : 1) - (b.info.k === 'over' ? 0 : 1) || String(a.o.byDate).localeCompare(String(b.o.byDate)));

  return (
    <>
      <div className="hello">
        <div>
          <h1>{mine ? 'My purchase orders' : 'Purchase orders'}</h1>
          <div className="muted">
            {mine ? 'Orders placed for the indents you created. Only the Purchase section can extend or close an order.' : 'Follow every order after it is issued. Late orders get an Extension button.'}
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><div className="n">{ongoing.length}</div><div className="t">{mine ? 'Your ongoing orders' : 'Ongoing orders'}</div></div>
        <div className={`stat ${overdue ? 'act' : ''}`}><div className="n" style={overdue ? { color: 'var(--red)' } : undefined}>{overdue}</div><div className="t">Overdue</div></div>
        <div className="stat"><div className="n">{soon}</div><div className="t">Due within 7 days</div></div>
      </div>

      <div className="card">
        <div className="tabs" role="tablist">
          <button className={tab !== 'done' ? 'on' : ''} onClick={() => setTab('ongoing')}>Ongoing<span className="ct">{ongoing.length}</span></button>
          <button className={tab === 'done' ? 'on' : ''} onClick={() => setTab('done')}>Delivered or cancelled<span className="ct">{finished.length}</span></button>
        </div>
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={16} />
            <input className="inp" placeholder="Search by PO number, item or supplier" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search purchase orders" />
          </div>
        </div>
        <div className="tablewrap">
          {rows.length ? (
            <table>
              <thead>
                <tr><th>Purchase order</th><th>Item and supplier</th><th>Ordered</th><th>Due by</th><th style={{ minWidth: 150 }}>Progress</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {rows.map(({ o, info }) => {
                  const ext = (o.order.ext || []).length;
                  return (
                    <tr key={o.id} style={{ cursor: 'default' }}>
                      <td><b>{o.po || 'Not issued'}</b><div className="xs muted">{o.no}</div></td>
                      <td>{o.title}<div className="xs muted">{o.vendor}</div></td>
                      <td className="small">{dstr(o.date)}</td>
                      <td className="small">{dstr(o.byDate)}{ext > 0 && <div className="xs muted">Extended {ext} time{ext > 1 ? 's' : ''}</div>}</td>
                      <td>
                        <span className={`chip ${info.chip}`}>{info.lbl}</span>
                        <div className={`pbx ${info.k === 'over' ? 'over' : info.k === 'cancel' ? 'cx' : ''}`}><i style={{ width: info.pct + '%' }} /></div>
                        {o.order.cancel && <div className="xs muted" style={{ marginTop: 4 }}>{o.order.cancel.reason}</div>}
                      </td>
                      <td>
                        <div className="row wrap" style={{ gap: 6 }}>
                          {!mine && info.k === 'over' && <Button variant="gold" size="sm" onClick={() => setDialog({ kind: 'extend', order: o })}>Extension</Button>}
                          {!mine && (info.k === 'open' || info.k === 'over') && <Button variant="sec" size="sm" onClick={() => setDialog({ kind: 'deliver', order: o })}>Mark delivered</Button>}
                          {o.stage === 'DONE' && <Button variant="sec" size="sm" onClick={() => navigate(`/indents/${o.id}/preview?kind=po`)}>View PO</Button>}
                          <Button variant="sec" size="sm" onClick={() => navigate(`/indents/${o.id}`)}>Indent</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty">
              <b>{tab === 'done' ? 'Nothing delivered or cancelled yet' : 'No ongoing orders'}</b>
              {mine ? 'Orders appear here once Purchase fills the PO form for one of your indents.' : 'Orders show up here as soon as a purchase order is filled.'}
            </div>
          )}
        </div>
      </div>

      {dialog && dialog.kind === 'extend' && (
        <ExtendDialog
          order={dialog.order} periods={lists.deliveryPeriod} onClose={() => setDialog(null)}
          onDone={(text) => { setDialog(null); toast(text); }}
        />
      )}
      {dialog && dialog.kind === 'deliver' && (
        <PasswordDialog
          title="Mark as delivered" gold btn="Mark delivered" remPh="Optional note, e.g. received and checked at Central Stores."
          lines={[`${dialog.order.po} · ${dialog.order.title}`, `Supplier: ${dialog.order.vendor}`]}
          onSubmit={async (v) => {
            await deliverOrder(dialog.order.id, v.remarks, v.password);
            toast(`${dialog.order.po} marked as delivered (preview only)`);
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}

// "Extend or cancel the order": pick a new delivery date, or cancel the order with a reason.
function ExtendDialog({ order, periods, onClose, onDone }) {
  const [choice, setChoice] = useState(periods[0] || 'Pick a date'); // a period, "Pick a date" or "Order cancelled"
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const cancelling = choice === 'Order cancelled';
  const picking = choice === 'Pick a date';

  async function submit() {
    const e = {};
    if (picking && !(date && date > todayStr())) e.date = 'Choose a date after today.';
    if (cancelling && !reason.trim()) e.reason = 'Give a reason for cancelling the order.';
    if (!password) e.pw = 'Enter your password to confirm.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const newDate = picking ? date : presetDate(todayStr(), choice);
    if (cancelling) await cancelOrder(order.id, reason.trim(), password);
    else await extendOrder(order.id, newDate, reason.trim(), password);
    onDone(cancelling ? `${order.po} is cancelled (preview only)` : `Delivery moved to ${dstr(newDate)} (preview only)`);
  }

  return (
    <Modal
      title="Extend or cancel the order" onClose={onClose}
      footer={<><Button variant="sec" onClick={onClose}>Close</Button><Button variant={cancelling ? 'danger' : 'gold'} onClick={submit}>{cancelling ? 'Cancel the order' : 'Extend delivery'}</Button></>}
    >
      <div className="sum">
        <div><b>{order.po}</b> · {order.title}</div>
        <div>Supplier: {order.vendor}</div>
        <div>Was due on {dstr(order.byDate)}</div>
      </div>
      <Field label="New delivery date" htmlFor="choice">
        <select id="choice" className="sel" value={choice} onChange={(e) => setChoice(e.target.value)}>
          {periods.map((p) => <option key={p} value={p}>{p} from today ({dstr(presetDate(todayStr(), p))})</option>)}
          <option value="Pick a date">Pick a date</option>
          <option value="Order cancelled">Order cancelled</option>
        </select>
      </Field>
      {picking && (
        <Field label="Pick the new date" error={errors.date} htmlFor="date">
          <input id="date" className="inp" type="date" min={addDays(todayStr(), 1)} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      )}
      {cancelling && <div className="alert warn mb16"><Icon name="info" size={18} /><span>The order will be closed and marked as cancelled. Give the reason below.</span></div>}
      <Field label={cancelling ? 'Reason for cancelling (required)' : 'Reason for the extension (optional)'} error={errors.reason} htmlFor="reason">
        <textarea id="reason" className="txt" placeholder={cancelling ? 'Why is this order being cancelled?' : 'e.g. Supplier stock delayed.'} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <Field label="Your password" error={errors.pw} htmlFor="pw">
        <input id="pw" className="inp" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
    </Modal>
  );
}

// "Extend or cancel the order": pick a new delivery date, or cancel the order with a reason.
function ExtendDialog({ order, periods, onClose, onDone }) {
  const [choice, setChoice] = useState(periods[0] || 'Pick a date'); // a period, "Pick a date" or "Order cancelled"
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const cancelling = choice === 'Order cancelled';
  const picking = choice === 'Pick a date';

  async function submit() {
    const e = {};
    if (picking && !(date && date > todayStr())) e.date = 'Choose a date after today.';
    if (cancelling && !reason.trim()) e.reason = 'Give a reason for cancelling the order.';
    if (!password) e.pw = 'Enter your password to confirm.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const newDate = picking ? date : presetDate(todayStr(), choice);
    if (cancelling) await cancelOrder(order.id, reason.trim(), password);
    else await extendOrder(order.id, newDate, reason.trim(), password);
    onDone(cancelling ? `${order.po} is cancelled` : `Delivery moved to ${dstr(newDate)}`);
  }

  return (
    <Modal
      title="Extend or cancel the order" onClose={onClose}
      footer={<><Button variant="sec" onClick={onClose}>Close</Button><Button variant={cancelling ? 'danger' : 'gold'} onClick={submit}>{cancelling ? 'Cancel the order' : 'Extend delivery'}</Button></>}
    >
      <div className="sum">
        <div><b>{order.po}</b> · {order.title}</div>
        <div>Supplier: {order.vendor}</div>
        <div>Was due on {dstr(order.byDate)}</div>
      </div>
      <Field label="New delivery date" htmlFor="choice">
        <select id="choice" className="sel" value={choice} onChange={(e) => setChoice(e.target.value)}>
          {periods.map((p) => <option key={p} value={p}>{p} from today ({dstr(presetDate(todayStr(), p))})</option>)}
          <option value="Pick a date">Pick a date</option>
          <option value="Order cancelled">Order cancelled</option>
        </select>
      </Field>
      {picking && (
        <Field label="Pick the new date" error={errors.date} htmlFor="date">
          <input id="date" className="inp" type="date" min={addDays(todayStr(), 1)} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      )}
      {cancelling && <div className="alert warn mb16"><Icon name="info" size={18} /><span>The order will be closed and marked as cancelled. Give the reason below.</span></div>}
      <Field label={cancelling ? 'Reason for cancelling (required)' : 'Reason for the extension (optional)'} error={errors.reason} htmlFor="reason">
        <textarea id="reason" className="txt" placeholder={cancelling ? 'Why is this order being cancelled?' : 'e.g. Supplier stock delayed.'} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <Field label="Your password" error={errors.pw} htmlFor="pw">
        <input id="pw" className="inp" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
    </Modal>
  );
}