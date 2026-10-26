import { useEffect, useMemo, useState } from 'react';
import { listUsers, saveUser } from '../../api/admin.js';
import { useLists } from '../../hooks/useLists.js';
import { ROLES, ROLE_ORDER, roleLabel, roleOf, nameDesig, initials } from '../../utils/roles.js';
import Modal from '../../components/ui/Modal.jsx';
import Field from '../../components/ui/Field.jsx';
import Button from '../../components/ui/Button.jsx';
import { Chip } from '../../components/ui/StatusChip.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Sujeet. Admin: all users. Pick one on the left to change role, department or designation,
// or to authorise, block or decline. Saving is a preview for now: it shows a message only.
const STATUS_TONE = { authorised: 'green', pending: 'amber', blocked: 'red', declined: 'gray' };

export default function AdminUsers() {
  const [lists] = useLists();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { listUsers().then(setUsers); }, []);
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };
  const selected = users.find((u) => u.id === selectedId);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return users.filter((u) => (filter === 'all' || u.status === filter) && (!needle || (u.name + u.email + u.dept).toLowerCase().includes(needle)));
  }, [users, q, filter]);
  const groups = ROLE_ORDER.map((label) => ({ label, people: shown.filter((u) => roleLabel(u) === label) })).filter((g) => g.people.length);
  const waiting = users.filter((u) => u.status === 'pending').length;

  async function change(id, changes, text) {
    await saveUser(id, changes);
    toast(text + ' (preview only)');
  }

  return (
    <>
      <div className="hello">
        <div>
          <h1>Users</h1>
          <div className="muted">Authorise new sign-ups and change roles.</div>
        </div>
        <Button onClick={() => setAdding(true)} icon="plus">Add user</Button>
      </div>
      <div className="split">
        <div className="card">
          <div className="toolbar">
            <div className="search">
              <Icon name="search" size={16} />
              <input className="inp" placeholder="Search name, email or department" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" />
            </div>
            <select className="sel" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
              <option value="all">All</option>
              <option value="pending">Waiting ({waiting})</option>
              <option value="authorised">Authorised</option>
              <option value="blocked">Blocked</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div className="list">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="ugroup"><span>{g.label}</span><span>{g.people.length}</span></div>
                {g.people.map((u) => (
                  <button key={u.id} className={`lrow ${u.id === selectedId ? 'on' : ''}`} onClick={() => setSelectedId(u.id)}>
                    <div className="av">{initials(u.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="t1">{u.name}</div>
                      <div className="t2">{u.desig || 'No designation'} · {u.dept}</div>
                    </div>
                    {u.status !== 'authorised' && <Chip tone={STATUS_TONE[u.status]}>{u.status === 'pending' ? 'Waiting' : u.status}</Chip>}
                  </button>
                ))}
              </div>
            ))}
            {!groups.length && <div className="empty"><b>No users found</b></div>}
          </div>
        </div>

        <div className="card dtl">
          {!selected ? <div className="empty"><b>Pick a user</b>Their profile and the actions show here.</div> : (
            <Profile key={selected.id} user={selected} lists={lists} change={change} />
          )}
        </div>
      </div>
      {adding && <AddUserDialog lists={lists} onClose={() => setAdding(false)} onDone={() => { setAdding(false); toast('User added (preview only)'); }} />}
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}

function Profile({ user, lists, change }) {
  const [role, setRole] = useState(roleOf(user));
  const [dept, setDept] = useState(user.dept);
  const [desig, setDesig] = useState(user.desig || '');
  const changed = role !== roleOf(user) || dept !== user.dept || desig.trim() !== (user.desig || '');

  return (
    <>
      <div className="row" style={{ gap: 14 }}>
        <div className="av" style={{ width: 52, height: 52, fontSize: 16 }}>{initials(user.name)}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{nameDesig(user)}</h2>
          <div className="muted">{user.email}</div>
        </div>
        <Chip tone={STATUS_TONE[user.status]}>{user.status}</Chip>
      </div>

      <div className="pbar">
        {user.status !== 'authorised' && <Button variant="gold" onClick={() => change(user.id, { status: 'authorised', role }, `${user.name} is authorised`)}>Authorise</Button>}
        {user.status === 'authorised' && <Button variant="danger" onClick={() => change(user.id, { status: 'blocked' }, `${user.name} is blocked`)}>Block</Button>}
        {user.status === 'pending' && <Button variant="sec" onClick={() => change(user.id, { status: 'declined' }, 'Request declined')}>Decline</Button>}
      </div>

      <div className="sechead">Role and place</div>
      <div className="fgrid">
        <Field label="Role" htmlFor="role" className="fw-third">
          <select id="role" className="sel" value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.entries(ROLES).filter(([k]) => k !== 'none').map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
            {role === 'none' && <option value="none">Not assigned</option>}
          </select>
        </Field>
        <Field label="Department" htmlFor="dept" className="fw-third">
          <select id="dept" className="sel" value={dept} onChange={(e) => setDept(e.target.value)}>
            {lists.department.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Designation" htmlFor="desig" className="fw-third">
          <input id="desig" className="inp" value={desig} onChange={(e) => setDesig(e.target.value)} />
        </Field>
      </div>
      <Button disabled={!changed} onClick={() => change(user.id, { role, dept, desig: desig.trim() }, 'Changes saved')}>Save changes</Button>
    </>
  );
}

function AddUserDialog({ lists, onClose, onDone }) {
  const [form, setForm] = useState({ name: '', email: '', dept: '', role: 'ind' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    if (!form.name.trim() || !form.email.trim() || !form.dept) return setError('Fill in the name, the college email and the department.');
    await saveUser('new', { ...form, status: 'authorised' });
    onDone();
  }

  return (
    <Modal
      title="Add user" onClose={onClose}
      footer={<><Button variant="sec" onClick={onClose}>Close</Button><Button variant="gold" onClick={submit}>Add user</Button></>}
    >
      {error && <div className="alert bad mb16" role="alert"><Icon name="info" size={18} /><span>{error}</span></div>}
      <Field label="Full name" htmlFor="an"><input id="an" className="inp" value={form.name} onChange={set('name')} placeholder="e.g. Dr. Rohit Mehra" /></Field>
      <Field label="College email" htmlFor="ae">
        <div className="inwrap">
          <input id="ae" className="inp" value={form.email} onChange={set('email')} placeholder="e.g. rohit.m" />
          <span className="suf">@iitrpr.ac.in</span>
        </div>
      </Field>
      <Field label="Department" htmlFor="ad">
        <select id="ad" className="sel" value={form.dept} onChange={set('dept')}>
          <option value="">Select a department</option>
          {lists.department.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Role" htmlFor="ar">
        <select id="ar" className="sel" value={form.role} onChange={set('role')}>
          {Object.entries(ROLES).filter(([k]) => k !== 'none').map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
        </select>
      </Field>
    </Modal>
  );
}
