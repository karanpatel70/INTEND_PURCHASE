import { useRef } from 'react';
import Field from '../../ui/Field.jsx';
import Icon from '../../ui/Icon.jsx';
import Button from '../../ui/Button.jsx';
import { USE_MOCKS } from '../../../api/client.js';

// Attach files. The answer is a list of { n: name, s: size, by: user id }.
// (Right now only the name and size are kept. The backend will store the real file later.)
export default function FileField({ field, value, onChange, error, readOnly, className, ctx }) {
  const files = value || [];
  const input = useRef(null);
  const add = (list) => onChange(field.name, [...files, ...list]);

  function onPick(e) {
    add([...e.target.files].map((f) => ({ n: f.name, s: Math.max(1, Math.round(f.size / 1024)) + ' KB', by: ctx.user.id })));
    e.target.value = '';
  }
  function addSample() {
    const names = ['Quotation', 'Specification-sheet', 'GeM-report'];
    add([{ n: `${names[files.length % 3]}${files.length >= 3 ? '-' + (files.length + 1) : ''}.pdf`, s: Math.round(60 + Math.random() * 300) + ' KB', by: ctx.user.id }]);
  }
  const remove = (k) => onChange(field.name, files.filter((_, x) => x !== k));

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
      {!readOnly && USE_MOCKS && (
        <div className="xs muted" style={{ marginTop: 6 }}>
          No file at hand? <a className="mail" onClick={addSample}>Add a sample file</a> (demo only).
        </div>
      )}
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
