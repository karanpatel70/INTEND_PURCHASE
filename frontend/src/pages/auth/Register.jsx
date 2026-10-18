import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../api/auth.js';
import { useLists } from '../../hooks/useLists.js';
import Icon from '../../components/ui/Icon.jsx';
import Field from '../../components/ui/Field.jsx';


const WANTED_ROLES = ['Indenter (faculty or staff)', 'HOD', 'Accounts section', 'Purchase section', 'Registrar office', 'Not sure, Admin will decide'];
const empty = { name: '', email: '', desig: '', dept: '', req: WANTED_ROLES[0], password: '', password2: '' };

export default function Register() {
  const [lists] = useLists();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await register(form);
      setSentTo(res.email);
    } catch (err) {
      setError(err.message);
    }
  }

  const top = (
    <div className="top1">
      <div className="mark" style={{ width: 42, height: 42 }}>PI</div>
      <div><b>Purchase Indent System</b><span>IIT Ropar, Stores and Purchase</span></div>
    </div>
  );

  if (sentTo) {
    return (
      <div className="loginwrap"><div className="login">
        {top}
        <h2>Request sent</h2>
        <div className="alert info mb16" style={{ marginTop: 14 }}>
          <Icon name="check" size={18} />
          <span>Your account <b>{sentTo}</b> is waiting for Admin approval. Once the Admin authorises it and assigns your role, you can pick your name on the sign in page.</span>
        </div>
        <Link className="btn" style={{ width: '100%' }} to="/login">Back to sign in</Link>
      </div></div>
    );
  }

  return (
    <div className="loginwrap">
      <div className="login">
        {top}
        <h2>Create an account</h2>
        <p className="muted small" style={{ margin: '4px 0 18px' }}>Your account stays on hold until the Admin authorises it and assigns your role.</p>
        {error && <div className="alert bad mb16" role="alert"><Icon name="info" size={18} /><span>{error}</span></div>}
        <form onSubmit={submit} noValidate>
          <Field label="Full name" htmlFor="name"><input id="name" className="inp" autoComplete="name" placeholder="e.g. Dr. Rohit Mehra" value={form.name} onChange={set('name')} /></Field>
          <Field label="College email" htmlFor="email">
            <div className="inwrap">
              <input id="email" className="inp" autoComplete="username" placeholder="e.g. rohit.m" value={form.email} onChange={set('email')} />
              <span className="suf">@iitrpr.ac.in</span>
            </div>
          </Field>
          <div className="g2">
            <Field label="Designation" htmlFor="desig">
              <input id="desig" className="inp" list="desigList" placeholder="Optional, e.g. Assistant Professor" value={form.desig} onChange={set('desig')} />
              <datalist id="desigList">{lists.designation.map((x) => <option key={x} value={x} />)}</datalist>
            </Field>
            <Field label="Department" htmlFor="dept">
              <select id="dept" className="sel" value={form.dept} onChange={set('dept')}>
                <option value="">Select your department</option>
                {lists.department.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Role you need" htmlFor="req" hint="The Admin confirms the final role.">
            <select id="req" className="sel" value={form.req} onChange={set('req')}>{WANTED_ROLES.map((x) => <option key={x}>{x}</option>)}</select>
          </Field>
          <div className="g2">
            <Field label="Password" htmlFor="pw"><input id="pw" className="inp" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} /></Field>
            <Field label="Confirm password" htmlFor="pw2"><input id="pw2" className="inp" type="password" autoComplete="new-password" placeholder="Type it again" value={form.password2} onChange={set('password2')} /></Field>
          </div>
          <div className="xs muted" style={{ margin: '-6px 0 12px' }}>Optional for now. Leave both empty to skip.</div>
          <button className="btn" style={{ width: '100%', marginTop: 4 }} type="submit">Send for approval</button>
        </form>
        <div className="small" style={{ marginTop: 14, textAlign: 'center' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
