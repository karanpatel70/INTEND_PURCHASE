import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLists } from '../../hooks/useLists.js';
import { useFormTemplate } from '../../hooks/useFormTemplate.js';
import { doAction, getIndent } from '../../api/indents.js';
import { stages, SECTION_NAMES } from '@shared/workflow.js';
import { validateSection, withTotals } from '@shared/rules.js';
import FormRenderer, { SectionView, initialValues } from '../../components/forms/FormRenderer.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Answers copied from the indenter section, so the approver does not type them again.
function prefillFor(key, d) {
  if (key === 'accounts') return { head: d.budgetHead, sanctioned: d.sanctioned };
  if (key === 'po') return { subject: d.title, vendor: d.vendor, qno: d.qno, qdate: d.qdate, items: d.items, gstPct: d.tax, deliverTo: d.caddr };
  return {};
}

// Owner: Rahul. ONE page for the Accounts, Purchase and PO sections. The indent's current step says which
// section this person fills (shared/workflow.js: "fillSection"). The other sections are shown locked.
// Saving is a preview for now: it checks the form, then goes back to the indent page.
export default function FillSection() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists] = useLists();
  const [indent, setIndent] = useState(null);
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const template = useFormTemplate(indent && indent.formCode);
  const ctx = { user, lists };

  useEffect(() => {
    getIndent(id).then(setIndent).catch(() => setIndent(false));
  }, [id]);

  const key = indent && stages[indent.stage].fillSection;
  const section = template && key ? template.sections.find((s) => s.key === key) : null;

  // the starting answers: what is already saved, or the defaults of the section
  useEffect(() => {
    if (!indent || !section || values) return;
    setValues({ ...initialValues(section, ctx), ...prefillFor(key, indent.data.indenter), ...(indent.data[key] || {}) });
  }, [indent, section]);

  if (indent === false) return <div className="empty"><b>Indent not found</b>It may have been deleted.</div>;
  if (!indent || !template) return null;
  if (!key || indent.holder !== user.id) {
    return <div className="empty"><b>Nothing to fill</b>This indent is not waiting for you.</div>;
  }
  if (!values) return null;

  const filledNote = (k) => (indent.data[k] ? 'Filled by ' + indent.people[indent.data[k].by].name : 'Not filled yet');
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };

  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  async function save() {
    const found = validateSection(section, withTotals(section, values));
    setErrors(found);
    if (Object.keys(found).length) {
      toast('Some fields need attention. They are marked in red.');
      return setTimeout(() => document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
    await doAction(id, 'fill', { section: key, values });
    navigate(`/indents/${id}`, { state: { toast: `${SECTION_NAMES[key]} section checked (preview only, nothing is saved yet)` } });
  }

  const locked = (k) => (
    <FormRenderer key={k} template={template} sectionKey={k} state="locked" lockNote={filledNote(k)} values={indent.data[k] || {}} onChange={() => {}} ctx={ctx} />
  );
  const showPO = key === 'po' || indent.data.po;

  return (
    <>
      <div className="crumb">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link> /{' '}
        <Link to={`/indents/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{indent.no}</Link> / Fill form
      </div>
      <div className="newtab">
        <Icon name="file" size={20} />
        <div>
          <b>Fill form · {indent.no} · {indent.formCode}</b>
          <div className="small muted">Only the {SECTION_NAMES[key]} section can be edited. After you save, the indent page opens again.</div>
        </div>
      </div>

      <SectionView section={template.sections[0]} values={indent.data.indenter} indent={indent} ctx={ctx} />
      {['accounts', 'purchase'].map((k) =>
        k === key
          ? <FormRenderer key={k} template={template} sectionKey={k} state="editing" values={values} onChange={setValue} errors={errors} ctx={ctx} />
          : locked(k)
      )}
      {showPO && (key === 'po'
        ? <FormRenderer template={template} sectionKey="po" state="editing" values={values} onChange={setValue} errors={errors} ctx={ctx} />
        : locked('po'))}

      <div style={{ height: 70 }} />
      <div className="stickybar">
        <div className="in">
          <div className="muted small">Saving is a preview for now. The backend will store it later.</div>
          <div className="row">
            <Button variant="sec" onClick={() => navigate(`/indents/${id}`)}>Cancel</Button>
            <Button variant="gold" icon="check" onClick={save}>Save and close</Button>
          </div>
        </div>
      </div>
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}