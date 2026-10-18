import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listIndents } from '../../api/indents.js';
import { isOpen } from '@shared/workflow.js';
import { isIndenterOnly, roleLabel } from '../../utils/roles.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Rahul. Home page: greeting, numbers, and the tabs "Pending approvals / My indents / ...".
export default function Dashboard() {
  const { user } = useAuth();
  const [indents, setIndents] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const indenterOnly = isIndenterOnly(user);
  const [q, setQ] = useState('');

  useEffect(() => { listIndents().then(setIndents); }, []);
  // waiting for me: it is with me, still open, and not just my own draft
  const needsMe = (i) => i.holder === user.id && isOpen(i) && i.stage !== 'DRAFT';

  // which tabs this user has
  const tabs = [
    ...(indenterOnly ? [] : [['pending', 'Pending approvals']]),
    ['mine', 'My indents'],
    ...(user.tiers.includes('hod') ? [['dept', 'Department indents']] : indenterOnly ? [] : [['handled', 'Handled by me']]),
  ];
  const [tab, setTab] = useState(() => (state && state.tab) || (indenterOnly ? 'mine' : 'pending'));
  const activeTab = tabs.some((t) => t[0] === tab) ? tab : tabs[0][0];

  const rowsFor = (k) => {
    if (k === 'pending') return indents.filter((i) => needsMe(i) && i.by !== user.id);
    if (k === 'mine') return indents.filter((i) => i.by === user.id);
    if (k === 'handled') return indents.filter((i) => i.by !== user.id && !needsMe(i) && i.handledBy.includes(user.id));
    return indents.filter((i) => i.by !== user.id); // dept
  };

  // numbers on top
  const mine = indents.filter((i) => i.by === user.id);
  const scope = indenterOnly ? mine : indents;
  const pending = indents.filter((i) => needsMe(i)).length;
  const drafts = mine.filter((i) => i.stage === 'DRAFT').length;
  const inProgress = scope.filter((i) => isOpen(i) && i.stage !== 'DRAFT').length;
  const approved = scope.filter((i) => i.stage === 'DONE').length;

  let rows = rowsFor(activeTab);
  const needle = q.trim().toLowerCase();
  if (needle) rows = rows.filter((i) => (i.no + i.title + i.byName).toLowerCase().includes(needle));
  rows = [...rows].sort((a, b) => needsMe(b) - needsMe(a) || new Date(b.updatedAt) - new Date(a.updatedAt));

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const w = user.name.split(' ');
  const firstName = /^(Dr\.|Prof\.)$/.test(w[0]) ? w[0] + ' ' + w[1] : w[0];

  const emptyText = {
    pending: ['Nothing is waiting for you', 'New indents will show up here as soon as they reach you.'],
    mine: ['You have not created any indents', 'Use Create indent to raise one.'],
  }[activeTab] || ['No indents here', 'Try another tab or clear the search.'];

  return (
    <>
      <div className="hello">
        <div>
          <h1>{greet}, {firstName}</h1>
          <div className="muted">{[user.desig, roleLabel(user)].filter(Boolean).join(' · ')}</div>
        </div>
        <Button variant="gold" icon="plus" onClick={() => navigate('/indents/new')}>Create indent</Button>
      </div>

      <div className={`stats ${drafts || indenterOnly ? 's4' : ''}`}>
        <div className={`stat ${pending ? 'act' : ''}`}><div className="n">{pending}</div><div className="t">{indenterOnly ? 'Returned to you' : 'Pending approvals'}</div></div>
        {(drafts > 0 || indenterOnly) && <div className="stat"><div className="n">{drafts}</div><div className="t">Drafts</div></div>}
        <div className="stat"><div className="n">{inProgress}</div><div className="t">In progress</div></div>
        <div className="stat"><div className="n">{approved}</div><div className="t">Approved</div></div>
      </div>

      <div className="card">
        <div className="tabs" role="tablist">
          {tabs.map(([k, label]) => (
            <button key={k} className={activeTab === k ? 'on' : ''} onClick={() => setTab(k)}>
              {label}<span className="ct">{rowsFor(k).length}</span>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={16} />
            <input className="inp" placeholder="Search by indent number, item or indenter" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search indents" />
          </div>
        </div>
        <div className="tablewrap">
          {rows.length ? <DataTable rows={rows} needsApproval={needsMe} /> : <div className="empty"><b>{emptyText[0]}</b>{emptyText[1]}</div>}
        </div>
      </div>
    </>
  );
}
