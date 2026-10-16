import { useState } from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import Field from './Field.jsx';
import Icon from './Icon.jsx';
import { nameDesig, emailLocal } from '../../utils/roles.js';

//   onClose
function firstChoice(groups, prefer = []) {
  const people = (groups || []).flatMap((g) => g.people);
  const preferred = [...prefer].reverse().find((id) => people.some((p) => p.id === id));
  return preferred || (people.length === 1 ? people[0].id : '');
}

export default function PasswordDialog({ title, lines = [], heading, groups, needRem, remPh, remErr, danger, gold, btn, prefer, onSubmit, onClose }) {
  const [target, setTarget] = useState(() => firstChoice(groups, prefer));
  const [remarks, setRemarks] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  async function submit() {
    const e = {};
    if (groups && !target) e.target = 'Pick one person to continue.';
    if (needRem && !remarks.trim()) e.rem = remErr || 'Add a remark.';
    if (!password) e.pw = 'Enter your password to confirm.';
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      await onSubmit({ target, remarks: remarks.trim(), password });
      onClose();
    } catch (err) {
      setErrors({ general: err.message });
    }
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="sec" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : gold ? 'gold' : ''} onClick={submit}>{btn}</Button>
        </>
      }
    >
      <div className="sum">{lines.map((l, k) => <div key={k}>{l}</div>)}</div>

      {groups && (
        <Field label={heading} error={errors.target} htmlFor="target">
          <select id="target" className="sel" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="">Select a person</option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.people.map((p) => <option key={p.id} value={p.id}>{nameDesig(p)} · {emailLocal(p.email)}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
      )}

      <Field label={`Remarks ${needRem ? '(required)' : '(optional)'}`} error={errors.rem} htmlFor="remarks">
        <textarea id="remarks" className="txt" placeholder={remPh || 'Add a note for the next person.'} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      </Field>

      <Field label="Confirm with your password" error={errors.pw} htmlFor="cpw">
        <div className="pwd">
          <Icon name="lock" size={16} />
          <input id="cpw" className="inp" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </div>
      </Field>
      {errors.general && <div className="alert bad mb16" role="alert">{errors.general}</div>}
    </Modal>
  );
}
