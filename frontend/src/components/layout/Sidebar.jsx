import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listIndents } from '../../api/indents.js';
import { roleLabel, initials, isAdmin, isIndenterOnly, canSeeOrders } from '../../utils/roles.js';
import { isOpen } from '@shared/workflow.js';
import Icon from '../ui/Icon.jsx';

const ADMIN_MENU = [
  ['/', 'Dashboard', 'home'],
  ['/admin/indents', 'All indents', 'list'],
  ['/admin/users', 'Users', 'users'],
  ['/admin/control-panel', 'Control panel', 'shield'],
];

function menuFor(user) {
  if (isAdmin(user)) return ADMIN_MENU;
  return [
    ['/', 'Dashboard', 'home'],
    ...(isIndenterOnly(user) ? [] : [['/inbox', 'Inbox', 'send']]),
    ['/my-indents', 'My indents', 'file'],
    ['/indents/new', 'Create indent', 'plus'],
    ['/track', 'Track indent', 'route'],
    ...(canSeeOrders(user) ? [['/orders', 'Purchase orders', 'list']] : []),
  ];
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [waiting, setWaiting] = useState(0);

  // the amber number on "Dashboard": indents waiting for this user
  useEffect(() => {
    listIndents().then((rows) => setWaiting(rows.filter((i) => i.holder === user.id && isOpen(i) && i.stage !== 'DRAFT').length));
  }, [user]);

  return (
    <aside className="side">
      <a className="brand" onClick={() => navigate('/')} tabIndex={0} role="link">
        <div className="mark">PI</div>
        <div><b>Purchase Indent</b><span>IIT Ropar, Stores and Purchase</span></div>
      </a>

      <div className="navlbl">Menu</div>
      <nav className="nav" aria-label="Main">
        {menuFor(user).map(([to, label, icon]) => (
          <button key={to} className={pathname === to ? 'on' : ''} onClick={() => navigate(to)}>
            <Icon name={icon} size={17} />
            {label}
            {to === '/' && waiting > 0 && <span className="badge">{waiting}</span>}
          </button>
        ))}
      </nav>

      <div className="foot">
        <div className="usercard">
          <div className="av">{initials(user.name)}</div>
          <div><b>{user.name}</b><span>{user.desig || roleLabel(user)}</span></div>
          <button onClick={() => { logout(); navigate('/login'); }} title="Sign out" aria-label="Sign out"><Icon name="logout" size={17} /></button>
        </div>
      </div>
    </aside>
  );
}