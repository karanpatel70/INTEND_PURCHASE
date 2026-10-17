import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLists } from '../../hooks/useLists.js';
import { useLimits } from '../../hooks/useLimits.js';
import { useFormTemplates } from '../../hooks/useFormTemplate.js';
import { createIndent, getIndent, updateIndent } from '../../api/indents.js';
import { validateSection, withTotals } from '@shared/rules.js';
import { inr } from '../../utils/format.js';
import FormRenderer, { initialValues } from '../../components/forms/FormRenderer.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Rahul. Create a new indent (or edit a draft / returned one: /indents/:id/edit).
// There is NO form-specific code here. The fields come from the chosen form's JSON template.
export default function CreateIndent() {
  const { id } = useParams(); // present when editing
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [lists] = useLists();
  const forms = useFormTemplates();
  const { limitFor } = useLimits();

  const [formCode, setFormCode] = useState('');
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [indentNo, setIndentNo] = useState('');
  const ctx = { user, lists };
  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };

  const template = forms.find((f) => f.code === formCode);

  // start: a new form, or load the indent that is being edited
  useEffect(() => {
    if (!forms.length || values) return;
    if (id) {
      getIndent(id).then((i) => { setFormCode(i.formCode); setValues({ ...i.data.indenter }); setIndentNo(i.no); });
    } else {
      setFormCode(forms[0].code);
      setValues(initialValues(forms[0].sections[0], ctx));
    }
  }, [forms, id]);

  if (!template || !values) return null;
  const section = template.sections[0];

  // another form was chosen: keep the answers that still fit, add starting answers for new fields
  function changeForm(code) {
    const next = forms.find((f) => f.code === code);
    setFormCode(code);
    setValues({ ...initialValues(next.sections[0], ctx), ...values });
    setErrors({});
  }
  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  const withTotal = withTotals(section, values);
  const limit = limitFor(template, withTotal);
  const overLimit = withTotal.total > limit.amount;

  async function save(submit) {
    if (submit) {
      const found = validateSection(section, withTotal);
      setErrors(found);
      if (Object.keys(found).length) {
        toast('Some fields need attention. They are marked in red.');
        return setTimeout(() => document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      }
      if (overLimit) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return toast("The total is above this form's limit.");
      }
    }
    try {
      const data = { indenter: withTotal };
      const saved = id ? await updateIndent(id, user, formCode, data, submit) : await createIndent(user, formCode, data, submit);
      if (submit) {
        toast(`${saved.no} sent for approval`);
        navigate(`/indents/${saved.id}`);
      } else {
        toast('Draft saved');
        navigate('/', { state: { tab: 'mine' } });
      }
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      toast(err.message);
    }
  }

  return (
    <>
      <div className="crumb"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link> / {id ? 'Edit indent' : 'Create indent'}</div>

      <div className="formhead">
        <div>
          <h1>{id ? 'Edit ' + indentNo : 'Create indent'}</h1>
          <div className="muted">You fill the Indenter section. Accounts and Purchase fill their sections later.</div>
        </div>
        <div className="field" style={{ margin: 0, minWidth: 'min(100%,420px)' }}>
          <label className="lbl" htmlFor="form">Form</label>
          <select id="form" className="sel" value={formCode} onChange={(e) => changeForm(e.target.value)}>
            {forms.map((f) => <option key={f.code} value={f.code}>{f.name}</option>)}
          </select>
        </div>
      </div>

      {overLimit ? (
        <div className="alert warn mb16" role="alert">
          <Icon name="info" size={18} />
          <span><b>{inr(withTotal.total)} is above the {template.code} limit of {inr(limit.amount)}.</b> Pick another form from the list, or split the purchase.</span>
        </div>
      ) : (
        <div className="alert info mb16"><Icon name="info" size={18} /><span>{template.note}</span></div>
      )}

      <FormRenderer template={template} sectionKey="indenter" numberStart={1} values={values} onChange={setValue} errors={errors} ctx={ctx} />
      <FormRenderer template={template} sectionKey="accounts" numberStart={6} state="locked" lockNote="filled by Accounts" values={{}} onChange={() => {}} ctx={ctx} />
      <FormRenderer template={template} sectionKey="purchase" numberStart={7} state="locked" lockNote="filled by Purchase" values={{}} onChange={() => {}} ctx={ctx} />

      <div className="stickybar">
        <div className="in">
          <div className="muted small">Total <b>{inr(withTotal.total)}</b></div>
          <div className="row">
            <Button variant="sec" onClick={() => save(false)}>Save draft</Button>
            <Button variant="gold" onClick={() => save(true)}>Submit to HOD</Button>
          </div>
        </div>
      </div>
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}
