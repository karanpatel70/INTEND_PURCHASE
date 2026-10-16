import { useNavigate } from 'react-router-dom';
import { inr, fmt } from '../../utils/format.js';
import StatusChip from './StatusChip.jsx';


export default function DataTable({ rows, needsApproval }) {
  const navigate = useNavigate();
  return (
    <table>
      <thead>
        <tr>
          <th>Indent</th><th>Item</th><th>Form</th><th style={{ textAlign: 'right' }}>Amount</th><th>Stage</th><th>With</th><th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((i) => {
          const mine = needsApproval(i);
          return (
            <tr key={i.id} className={mine ? 'mine' : ''} onClick={() => navigate(`/indents/${i.id}`)}>
              <td>
                <b>{i.no}</b>
                {mine && <div><span className="chip c-amber xs" style={{ marginTop: 3 }}>Action needed</span></div>}
              </td>
              <td>{i.title}<div className="xs muted">{i.byName}</div></td>
              <td>{i.formCode}{i.gem && <div className="xs muted">GeM</div>}</td>
              <td className="tnum" style={{ textAlign: 'right' }}>{inr(i.total)}</td>
              <td><StatusChip stage={i.stage} /></td>
              <td className="small">
                {i.stage === 'DRAFT' ? <span className="muted">Not sent yet</span>
                  : i.holder ? <>{i.holderName}<div className="xs muted">{i.holderDesig}</div></>
                  : <span className="muted">{i.stage === 'DONE' ? 'Completed' : 'Closed'}</span>}
              </td>
              <td className="small muted">{fmt(i.updatedAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
