import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listLoginUsers } from '../../api/auth.js';
import { listIndents } from '../../api/indents.js';
import { USE_MOCKS } from '../../api/client.js';
import { roleLabel, nameDesig, initials } from '../../utils/roles.js';
import { isOpen } from '@shared/workflow.js';
import Icon from '../ui/Icon.jsx';

// Owner: Rahul. The left menu, with the sample-data role switcher (mock mode only) and the signed-in user at the bottom.
const MENU = [
  ['/', 'Dashboard', 'home'],
  ['/indents/new', 'Create indent', 'plus'],
  ['/track', 'Track indent', 'route'],
];

export default function Sidebar() {
  const { user, logout, switchTo } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [people, setPeople] = useState([]);
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    if (USE_MOCKS) listLoginUsers().then(setPeople);
  }, []);

  // the amber number on "Dashboard": indents waiting for this user
  useEffect(() => {
    listIndents().then((rows) => setWaiting(rows.filter((i) => i.holder === user.id && isOpen(i) && i.stage !== 'DRAFT').length));
  }, [user]);

  async function switchUser(id) {
    await switchTo(id);
    navigate('/');
  }

  return (
    <aside className="side">
      <a className="brand" onClick={() => navigate('/')} tabIndex={0} role="link">
        <div className="mark">PI</div>
        <div><b>Purchase Indent</b><span>IIT Ropar, Stores and Purchase</span></div>
      </a>

      <div className="navlbl">Menu</div>
      <nav className="nav" aria-label="Main">
        {MENU.map(([to, label, icon]) => (
          <button key={to} className={pathname === to ? 'on' : ''} onClick={() => navigate(to)}>
            <Icon name={icon} size={17} />
            {label}
            {to === '/' && waiting > 0 && <span className="badge">{waiting}</span>}
          </button>
        ))}
      </nav>

      <div className="foot">
        {USE_MOCKS && (
          <>
            <label htmlFor="asSel">Viewing as</label>
            <select id="asSel" value={user.id} onChange={(e) => switchUser(e.target.value)}>
              {people.map((p) => <option key={p.id} value={p.id}>{nameDesig(p)}</option>)}
            </select>
          </>
        )}
        <div className="usercard">
          <div className="av">{initials(user.name)}</div>
          <div><b>{user.name}</b><span>{user.desig || roleLabel(user)}</span></div>
          <button onClick={() => { logout(); navigate('/login'); }} title="Sign out" aria-label="Sign out"><Icon name="logout" size={17} /></button>
        </div>
      </div>
    </aside>
  );
}
