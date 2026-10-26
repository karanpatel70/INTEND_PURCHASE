import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listIndents } from '../../api/indents.js';
import { isOpen, stages, SECTION_NAMES } from '@shared/workflow.js';
import { inr, fmt } from '../../utils/format.js';
import StatusChip, { Chip } from '../../components/ui/StatusChip.jsx';
import Button from '../../components/ui/Button.jsx';

// Owner: Rahul. Indents that are waiting for the signed-in user, oldest first (the longest wait is on top).
// Each row says what is expected: fill a section, or just approve.
export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState(null);

  useEffect(() => { listIndents().then(setRows); }, []);
  if (!rows) return null;

  const waiting = rows
    .filter((i) => i.holder === user.id && isOpen(i) && i.stage !== 'DRAFT' && i.by !== user.id)
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  return (
    <>
      <div className="hello">
        <div>
          <h1>Inbox</h1>
          <div className="muted">Indents that are with you right now.</div>
        </div>
      </div>

      <div className="card">
        {waiting.length ? waiting.map((i) => {
          const sec = stages[i.stage].fillSection;
          return (
            <div key={i.id} className="lrow" style={{ cursor: 'default' }}>
              <div className="grow">
                <div className="row between wrap">
                  <div><span className="t1">{i.no}</span> <span className="muted">· {i.title}</span></div>
                  <StatusChip stage={i.stage} />
                </div>
                <div className="t2">
                  From {i.byName} · {inr(i.total)} · {i.formCode}{i.gem ? ' · GeM' : ''} · waiting since {fmt(i.updatedAt)}
                </div>
                {sec && <div className="mt8"><Chip tone="amber">Please fill the {SECTION_NAMES[sec]} section</Chip></div>}
              </div>
              <div className="row" style={{ gap: 8 }}>
                {sec && <Button variant="sec" size="sm" icon="edit" onClick={() => navigate(`/indents/${i.id}/fill/${sec}`)}>Fill form</Button>}
                <Button variant="gold" size="sm" onClick={() => navigate(`/indents/${i.id}`)}>Open</Button>
              </div>
            </div>
          );
        }) : <div className="empty"><b>Nothing is waiting for you</b>New indents will show up here as soon as they reach you.</div>}
      </div>
    </>
  );
}

