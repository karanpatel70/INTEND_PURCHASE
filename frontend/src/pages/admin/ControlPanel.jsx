import { useEffect, useState } from 'react';
import { useLists } from '../../hooks/useLists.js';
import { getLimits } from '../../api/forms.js';
import { listIndents } from '../../api/indents.js';
import { listUsers, addLimit, addListItem, removeListItem } from '../../api/admin.js';
import { isOpen, stages } from '@shared/workflow.js';
import { inr, dstr, todayStr } from '../../utils/format.js';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Admin: the settings the forms depend on. An overview, the price limits per form,
// and the dropdown lists. Saving anything is a preview for now: it only shows a message.
const LIST_CARDS = [
  { id: 'department', title: 'Departments', hint: 'Shown on the sign-up page and on every indent.' },
  { id: 'budgetHead', title: 'Budget heads', hint: 'The "Budget head" dropdown on the indent form.' },
  { id: 'designation', title: 'Designations', hint: 'Suggestions on the sign-up page.' },
  { id: 'deliveryPeriod', title: 'Delivery periods', hint: 'Choices for the delivery time on forms and extensions.' },
];

export default function ControlPanel() {
  const [message, setMessage] = useState('');
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };
  return (
    <>
      <div className="hello">
        <div>
          <h1>Control panel</h1>
          <div className="muted">Overview of the system and the settings the forms depend on.</div>
        </div>
      </div>
      <Overview />
      <LimitsCard toast={toast} />
      <div className="lgrid" style={{ marginTop: 16 }}>
        {LIST_CARDS.map((c) => <ListCard key={c.id} card={c} toast={toast} />)}
      </div>
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}

function Overview() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    listIndents().then(setRows);
    listUsers().then(setUsers);
  }, []);

  const byStage = Object.keys(stages)
    .map((k) => ({ k, label: stages[k].label, n: rows.filter((i) => i.stage === k).length }))
    .filter((s) => s.n);
  const max = Math.max(1, ...byStage.map((s) => s.n));

  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="stats s4">
        <div className="stat"><div className="n">{rows.length}</div><div className="t">Indents in total</div></div>
        <div className="stat"><div className="n">{rows.filter(isOpen).length}</div><div className="t">Still open</div></div>
        <div className="stat"><div className="n">{users.length}</div><div className="t">Users</div></div>
        <div className="stat"><div className="n">{users.filter((u) => u.status === 'pending').length}</div><div className="t">Sign-ups waiting</div></div>
      </div>
      <div className="cc">
        <h4>Indents by stage</h4>
        <div className="hb">
          {byStage.map((s) => (
            <div className="hbr" key={s.k}>
              <span className="hl">{s.label}</span>
              <span className="ht"><i style={{ width: (s.n / max) * 100 + '%', background: '#2a78d6' }} /></span>
              <b>{s.n}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// One dropdown list: show the items as chips, add a new one, remove one (screen only for now).
function ListCard({ card, toast }) {
  const [lists] = useLists();
  const [extra, setExtra] = useState([]);   // items added on this screen
  const [gone, setGone] = useState([]);     // items removed on this screen
  const [value, setValue] = useState('');
  const items = [...(lists[card.id] || []), ...extra].filter((x) => !gone.includes(x));

    async function add() {
    const v = value.trim();
    if (!v) return;
    if (items.some((x) => x.toLowerCase() === v.toLowerCase())) return toast('That item is already in the list.');
    await addListItem(card.id, v);
    setExtra([...extra, v]);
    setValue('');
    toast(`Added ${v}`);
  }

  async function remove(it) {
    await removeListItem(card.id, it);
    setGone([...gone, it]);
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <h3 style={{ margin: 0 }}>{card.title}</h3>
      <div className="muted small mb16">{card.hint}</div>
      <div className="lchips mb16">
        {items.map((it) => (
          <span className="lchip" key={it}>{it}<button aria-label={`Remove ${it}`} onClick={() => remove(it)}><Icon name="x" size={12} /></button></span>
        ))}
      </div>
      <div className="row" style={{ gap: 8 }}>
        <input className="inp" placeholder="Add a new item" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} aria-label={`New ${card.title}`} />
        <Button variant="sec" onClick={add}>Add</Button>
      </div>
    </div>
  );
}

// Form limits. A limit is never edited: a new row with a start date is added, and the old rows stay as history.
function LimitsCard({ toast }) {
  const [current, setCurrent] = useState([]);
  const [draft, setDraft] = useState({ key: '', amount: '', from: todayStr() });

  useEffect(() => { getLimits().then(setCurrent); }, []);
  const key = draft.key || (current[0] ? current[0].formCode + '|' + current[0].rule : '');

  async function save() {
    const [formCode, rule] = key.split('|');
    await addLimit({ formCode, rule, amount: Number(draft.amount), effectiveFrom: draft.from });
    setDraft({ key: '', amount: '', from: todayStr() });
    getLimits().then(setCurrent);
    toast('New limit saved');
  }

  return (
    <div className="card" style={{ padding: 18, marginTop: 16 }}>
      <h3 style={{ margin: 0 }}>Form limits</h3>
      <div className="muted small mb16">Indents above the limit are blocked when the indenter submits. Old limits are kept as history.</div>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Form</th><th>Rule</th><th style={{ textAlign: 'right' }}>Limit now</th><th>Since</th></tr></thead>
          <tbody>
            {current.map((l) => (
              <tr key={l.formCode + l.rule} style={{ cursor: 'default' }}>
                <td>{l.formCode}</td><td>{l.rule}</td><td className="tnum" style={{ textAlign: 'right' }}>{inr(l.amount)}</td><td className="small">{dstr(l.effectiveFrom)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sechead">Set a new limit</div>
      <div className="fgrid">
        <div className="fw-third">
          <label className="lbl" htmlFor="lk">Form and rule</label>
          <select id="lk" className="sel" value={key} onChange={(e) => setDraft({ ...draft, key: e.target.value })}>
            {current.map((l) => <option key={l.formCode + l.rule} value={l.formCode + '|' + l.rule}>{l.formCode} · {l.rule}</option>)}
          </select>
        </div>
        <div className="fw-third">
          <label className="lbl" htmlFor="la">New amount (₹)</label>
          <input id="la" className="inp" type="number" min="1" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
        </div>
        <div className="fw-third">
          <label className="lbl" htmlFor="lf">Applies from</label>
          <input id="lf" className="inp" type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
        </div>
      </div>
      <Button disabled={!(Number(draft.amount) > 0)} onClick={save}>Save new limit</Button>
    </div>
  );
}