import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listIndents } from '../../api/indents.js';
import { isOpen } from '@shared/workflow.js';
import DataTable from '../../components/ui/DataTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Rahul. Every indent the signed-in user created, with a filter by state and a search box.
const FILTERS = [
  ['all', 'All', () => true],
  ['draft', 'Drafts', (i) => i.stage === 'DRAFT'],
  ['returned', 'Returned to me', (i) => i.stage === 'RETURNED'],
  ['progress', 'In progress', (i) => isOpen(i) && !['DRAFT', 'RETURNED'].includes(i.stage)],
  ['done', 'Approved', (i) => i.stage === 'DONE'],
  ['closed', 'Rejected or cancelled', (i) => i.stage === 'REJECTED' || i.stage === 'CANCELLED'],
];

export default function MyIndents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => { listIndents().then(setRows); }, []);

  const mine = rows.filter((i) => i.by === user.id);
  const test = FILTERS.find((f) => f[0] === filter)[2];
  const needle = q.trim().toLowerCase();
  const shown = mine
    .filter(test)
    .filter((i) => !needle || (i.no + i.title).toLowerCase().includes(needle))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <>
      <div className="hello">
        <div>
          <h1>My indents</h1>
          <div className="muted">Everything you have created, from drafts to approved purchase orders.</div>
        </div>
        <Button variant="gold" icon="plus" onClick={() => navigate('/indents/new')}>Create indent</Button>
      </div>

      <div className="card">
        <div className="tabs" role="tablist">
          {FILTERS.map(([k, label, fn]) => (
            <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>
              {label}<span className="ct">{mine.filter(fn).length}</span>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={16} />
            <input className="inp" placeholder="Search by indent number or item" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search my indents" />
          </div>
        </div>
        <div className="tablewrap">
          {shown.length
            ? <DataTable rows={shown} needsApproval={(i) => i.stage === 'RETURNED'} />
            : <div className="empty"><b>No indents here</b>Try another filter, or use Create indent to raise one.</div>}
        </div>
      </div>
    </>
  );
}
