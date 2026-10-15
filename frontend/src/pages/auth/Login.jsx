import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { listLoginUsers } from '../../api/auth.js';
import { ROLE_ORDER, emailLocal } from '../../utils/roles.js';
import Icon from '../../components/ui/Icon.jsx';
import Field from '../../components/ui/Field.jsx';

// Owner: Sujeet. Sign in. For now you pick your name from a list (demo). The real server
// will ask for the college email + password instead: only the first box changes.
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listLoginUsers().then(setUsers).catch(() => {});
  }, []);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    if (!userId) return setError('Choose a user from the list.');
    try {
      await login(userId, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  // group the users by role, in the usual order
  const roleNames = [...ROLE_ORDER, ...new Set(users.map((u) => u.roleLabel).filter((r) => !ROLE_ORDER.includes(r)))];

  return (
    <div className="loginwrap">
      <div className="login">
        <div className="top1">
          <div className="mark" style={{ width: 42, height: 42 }}>PI</div>
          <div><b>Purchase Indent System</b><span>IIT Ropar, Stores and Purchase</span></div>
        </div>
        <h2>Sign in</h2>
        <p className="muted small" style={{ margin: '4px 0 18px' }}>Pick your name from the list.</p>
        {error && <div className="alert bad mb16" role="alert"><Icon name="info" size={18} /><span>{error}</span></div>}
        <form onSubmit={submit} noValidate>
          <Field label="User" htmlFor="user">
            <select id="user" className="sel" value={userId} onChange={(e) => setUserId(e.target.value)}>
              <option value="">Select a user</option>
              {roleNames.map((r) => {
                const group = users.filter((u) => u.roleLabel === r).sort((a, b) => a.name.localeCompare(b.name));
                if (!group.length) return null;
                return (
                  <optgroup key={r} label={r === 'Not assigned' ? 'Waiting for approval' : r}>
                    {group.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} · {emailLocal(u.email)}{u.status !== 'authorised' ? ' (not active)' : ''}</option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </Field>
          <Field label="Password" htmlFor="pw">
            <input id="pw" className="inp" type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <button className="btn" style={{ width: '100%', marginTop: 4 }} type="submit">Sign in</button>
        </form>
        <div className="small" style={{ marginTop: 14, textAlign: 'center' }}>
          New here? <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
