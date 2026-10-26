import { fmt } from '../../utils/format.js';

// Owner: Manvendra. The timeline of everything that happened to an indent, newest first.
// history = indent.history, people = indent.people (to turn a person id into a name).
const DOT = { g: 'g', o: 'o', r: 'r', y: '' }; // colour of the dot per kind of event

export default function HistoryList({ history, people, flat }) {
  if (!history.length) return <div className="card pad muted">Nothing has happened to this indent yet.</div>;
  return (
    <div className="card" style={flat ? { boxShadow: 'none' } : undefined}>
      <ol className="tl">
        {[...history].reverse().map((h, k) => {
          const p = people[h.pid] || { name: h.pid, desig: '', email: '' };
          return (
            <li key={k} className={DOT[h.type] || ''}>
              <div>
                <b>{p.name}</b> <span className="muted small">{p.desig}</span>
              </div>
              <div>{h.text}</div>
              {h.remark && <div className="rem">{h.remark}</div>}
              <div className="xs muted mt8">{fmt(h.t)}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}