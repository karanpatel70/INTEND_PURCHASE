import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listIndents } from '../../api/indents.js';
import { progressSteps, stepCurrent } from '@shared/workflow.js';
import { isIndenterOnly, isAccounts, isPurchase } from '../../utils/roles.js';
import StatusChip from '../../components/ui/StatusChip.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Manvendra. Search an indent and see how far it has got. Each row has a small six-step bar
// (green = done, gold = the step it is on now). An indenter sees only their own indents.
export default function TrackIndent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => { listIndents().then(setRows); }, []);

  const staff = isAccounts(user) || isPurchase(user);
  const needle = q.trim().toLowerCase();
  const shown = rows
    .filter((i) => !isIndenterOnly(user) || i.by === user.id)
    .filter((i) => i.stage !== 'DRAFT')
    .filter((i) => !needle || (i.no + i.title).toLowerCase().includes(needle))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <>
      <div className="hello">
        <div>
          <h1>Track indent</h1>
          <div className="muted">{staff ? 'Every indent and the step it has reached.' : 'Find an indent and see which step it has reached.'}</div>
        </div>
      </div>
      <div className="card">
        <div className="toolbar">
          <div className="search" style={{ maxWidth: 480 }}>
            <Icon name="search" size={16} />
            <input className="inp" placeholder="Enter an indent number or item name" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Track indent" />
          </div>
        </div>
        {shown.length ? shown.map((i) => {
          const cur = stepCurrent(i);
          return (
            <button key={i.id} className="lrow" onClick={() => navigate(`/indents/${i.id}`)}>
              <div className="grow">
                <div className="row between wrap">
                  <div><span className="t1">{i.no}</span> <span className="muted">· {i.title}</span></div>
                  <StatusChip stage={i.stage} />
                </div>
                <div className="t2">
                  {i.holder ? `With ${i.holderName}, ${i.holderDesig}` : i.stage === 'DONE' ? `Completed. ${i.po || ''}` : 'Closed'}
                </div>
                <div className="mini">
                  {progressSteps.map((s, k) => (
                    <span key={s} className={i.stage === 'DONE' || k < cur ? 'd' : k === cur ? 'c' : ''} title={s} />
                  ))}
                </div>
              </div>
            </button>
          );
        }) : <div className="empty"><b>No indent found</b>Check the number and try again.</div>}
      </div>
    </>
  );
}
