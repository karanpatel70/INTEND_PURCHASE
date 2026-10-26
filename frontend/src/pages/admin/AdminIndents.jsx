import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listIndents, getIndent, doAction } from '../../api/indents.js';
import { listUsers } from '../../api/admin.js';
import { isOpen } from '@shared/workflow.js';
import { fmt, inr } from '../../utils/format.js';
import { roleLabel } from '../../utils/roles.js';
import PasswordDialog from '../../components/ui/PasswordDialog.jsx';
import StatusChip from '../../components/ui/StatusChip.jsx';
import HistoryList from '../../components/ui/HistoryList.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Admin: every indent in the system. Pick one on the left, see its details and act on it on the right.
// Reroute and Delete open their dialogs but only show a message for now (preview).
export default function AdminIndents() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [people, setPeople] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('new');
  const [selected, setSelected] = useState(null); // the full indent
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    listIndents().then(setRows);
    listUsers().then(setPeople);
  }, []);
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.filter((i) => !needle || (i.no + i.title + i.byName).toLowerCase().includes(needle));
    const by = {
      new: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      amount: (a, b) => b.total - a.total,
      stage: (a, b) => a.stage.localeCompare(b.stage),
    };
    return [...list].sort(by[sort]);
  }, [rows, q, sort]);

  const open = (id) => getIndent(id).then(setSelected);

  function startReroute() {
    const groups = [...new Set(people.filter((p) => p.status === 'authorised' && p.tiers.length).map(roleLabel))]
      .map((label) => ({ label, people: people.filter((p) => p.status === 'authorised' && roleLabel(p) === label) }));
    setDialog({
      title: 'Reroute', lines: [`${selected.no} · ${selected.data.indenter.title}`, `Now with ${selected.holder ? selected.people[selected.holder].name : 'nobody'}`],
      heading: 'Move it to', groups, btn: 'Reroute', remPh: 'Optional reason.',
      onSubmit: async (v) => { await doAction(selected.id, 'reroute', v); setSelected(await getIndent(selected.id)); listIndents().then(setRows); toast('Indent rerouted'); },
    });
  }
  function startDelete() {
    setDialog({
      title: 'Delete this indent', lines: [`${selected.no} · ${selected.data.indenter.title}`, 'This removes it for everyone and cannot be undone.'],
      danger: true, btn: 'Delete',
      onSubmit: async (v) => { await doAction(selected.id, 'delete', v); setSelected(null); listIndents().then(setRows); toast('Indent deleted'); },
    });
  }

  return (
    <>
      <div className="hello">
        <div>
          <h1>All indents</h1>
          <div className="muted">See every indent. Reroute or delete when something is stuck.</div>
        </div>
      </div>
      <div className="split">
        <div className="card">
          <div className="toolbar">
            <div className="search">
              <Icon name="search" size={16} />
              <input className="inp" placeholder="Search number, item or name" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search indents" />
            </div>
            <select className="sel" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="new">Newest first</option>
              <option value="amount">Largest amount</option>
              <option value="stage">By stage</option>
            </select>
          </div>
          <div className="list">
            {shown.map((i) => (
              <button key={i.id} className={`lrow ${selected && selected.id === i.id ? 'on' : ''}`} onClick={() => open(i.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t1">{i.no} · {i.title}</div>
                  <div className="t2">{i.byName} · {inr(i.total)}</div>
                </div>
                <StatusChip stage={i.stage} />
              </button>
            ))}
            {!shown.length && <div className="empty"><b>No indents found</b></div>}
          </div>
        </div>

        <div className="card dtl">
          {!selected ? <div className="empty"><b>Pick an indent</b>Its details and the admin actions show here.</div> : (
            <>
              <h2 style={{ margin: 0 }}>{selected.data.indenter.title}</h2>
              <div className="row wrap" style={{ gap: 8, marginTop: 6 }}><b>{selected.no}</b><StatusChip stage={selected.stage} /></div>
              <div className="kv mt16">
                <div><span>Raised by</span><b>{selected.people[selected.by].name}</b></div>
                <div><span>Form</span><b>{selected.formCode}</b></div>
                <div><span>Amount</span><b>{inr(selected.total)}</b></div>
                <div><span>With</span><b>{selected.holder ? selected.people[selected.holder].name : 'Nobody (closed)'}</b></div>
                <div><span>Updated</span><b>{fmt(selected.updatedAt)}</b></div>
                <div><span>PO number</span><b>{selected.po || 'Not issued'}</b></div>
              </div>
              <div className="pbar">
                <Button variant="sec" onClick={() => navigate(`/indents/${selected.id}/preview`)}>View form</Button>
                {selected.po && <Button variant="sec" onClick={() => navigate(`/indents/${selected.id}/preview?kind=po`)}>View PO</Button>}
                <Button variant="sec" onClick={() => navigate(`/indents/${selected.id}`)}>Open page</Button>
                {isOpen(selected) && selected.stage !== 'DRAFT' && <Button variant="sec" onClick={startReroute}>Reroute</Button>}
                <Button variant="danger" onClick={startDelete}>Delete</Button>
              </div>
              <div className="sechead">History</div>
              <HistoryList history={selected.history} people={selected.people} />
            </>
          )}
        </div>
      </div>
      {dialog && <PasswordDialog {...dialog} onClose={() => setDialog(null)} />}
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}

