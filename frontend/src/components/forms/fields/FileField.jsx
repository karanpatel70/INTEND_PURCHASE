import { useRef, useState } from 'react';
import Field from '../../ui/Field.jsx';
import Icon from '../../ui/Icon.jsx';
import Button from '../../ui/Button.jsx';
import { rememberFile, forgetFile } from '../../../api/attachments.js';

const MAX_BYTES = 10 * 1024 * 1024; 


export default function FileField({ field, value, onChange, error, readOnly, className, ctx }) {
  const files = value || [];
  const input = useRef(null);
  const [note, setNote] = useState('');

  function onPick(e) {
    const picked = [...e.target.files];
    const tooBig = picked.filter((f) => f.size > MAX_BYTES);
    const good = picked.filter((f) => f.size <= MAX_BYTES);
    setNote(tooBig.length ? `${tooBig.map((f) => f.name).join(', ')}: over 10 MB, not added.` : '');
    good.forEach(rememberFile);
    onChange(field.name, [
      ...files,
      ...good.map((f) => ({ n: f.name, s: Math.max(1, Math.round(f.size / 1024)) + ' KB', b: f.size, by: ctx.user.id })),
    ]);
    e.target.value = '';
  }
  function remove(k) {
    forgetFile(files[k]);
    onChange(field.name, files.filter((_, x) => x !== k));
  }

  return (
    <Field label={null} error={error} className={className}>
      {!readOnly && (
        <div className="drop" onClick={() => input.current.click()} tabIndex={0} role="button">
          <Icon name="upload" size={22} />
          <div><b>{field.label}</b></div>
          <div className="xs">PDF, up to 10 MB each. Click to add a file.</div>
          <input ref={input} type="file" multiple hidden onChange={onPick} />
        </div>
      )}
      {note && <div className="xs" style={{ marginTop: 6, color: '#b91c1c' }}>{note}</div>}
      <ul className="docs">
        {files.map((d, k) => (
          <li key={k}>
            <div className="ico"><Icon name="file" size={18} /></div>
            <div className="grow"><b>{d.n}</b><div className="xs muted">{d.s}</div></div>
            {!readOnly && <Button variant="sec" size="sm" icon="x" onClick={() => remove(k)} aria-label={`Remove ${d.n}`} />}
          </li>
        ))}
      </ul>
    </Field>
  );
}
