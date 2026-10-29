import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/ui/Icon.jsx';
import Field from '../../components/ui/Field.jsx';

// Sign in with the college email and the password.
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return setError('Enter your college email.');
    if (!password) return setError('Enter your password.');
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="loginwrap">
      <div className="login">
        <div className="top1">
          <div className="mark" style={{ width: 42, height: 42 }}>PI</div>
          <div><b>Purchase Indent System</b><span>IIT Ropar, Stores and Purchase</span></div>
        </div>
        <h2>Sign in</h2>
        <p className="muted small" style={{ margin: '4px 0 18px' }}>Use your IIT Ropar email and password.</p>
        {error && <div className="alert bad mb16" role="alert"><Icon name="info" size={18} /><span>{error}</span></div>}
        <form onSubmit={submit} noValidate>
          <Field label="Email" htmlFor="email">
            <input id="email" className="inp" type="text" autoComplete="username" placeholder="name@iitrpr.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} />
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