import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLists } from '../../hooks/useLists.js';
import { useFormTemplate } from '../../hooks/useFormTemplate.js';
import { doAction, getIndent, getTargets } from '../../api/indents.js';
import { buttonState, isDead, stages, SECTION_NAMES } from '@shared/workflow.js';
import { inr, fmt } from '../../utils/format.js';
import { nameDesig, initials } from '../../utils/roles.js';
import { SectionView } from '../../components/forms/FormRenderer.jsx';
import PasswordDialog from '../../components/ui/PasswordDialog.jsx';
import StatusChip, { Chip } from '../../components/ui/StatusChip.jsx';
import Stepper from '../../components/ui/Stepper.jsx';
import Button from '../../components/ui/Button.jsx';
import Icon from '../../components/ui/Icon.jsx';

// Owner: Karan. One indent: header, progress, three tabs (Form details / Documents / History)
// and, on the right, the box with the five buttons (Approve, Forward, Fill form, Revise, Reject).
// Documents and History are not built yet. The buttons open their dialogs but do not change the indent yet.
export default function IndentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lists] = useLists();
  const [indent, setIndent] = useState(null);
  const [tab, setTab] = useState('details');
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState('');
  const pickable = useRef([]); // the people shown in the open dialog, to find the name that was picked
  const template = useFormTemplate(indent && indent.formCode);

  useEffect(() => {
    setTab('details');
    getIndent(id).then(setIndent).catch(() => setIndent(false));
  }, [id]);

  if (indent === false) return <div className="empty"><b>Indent not found</b>It may have been deleted, or it is not yours to see.</div>;
  if (!indent || !template) return null;

  const i = indent;
  const d = i.data.indenter;
  const ctx = { user, lists };
  const st = stages[i.stage];
  const owner = i.people[i.by];
  const holder = i.holder ? i.people[i.holder] : null;
  const section = (key) => template.sections.find((s) => s.key === key);
  const showPO = i.data.po || i.po || st.step >= 5;
  const tabs = [['details', 'Form details'], ['docs', 'Documents'], ['history', 'History']];

  const toast = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3600); };

  // ---------- the five buttons ----------
  const summary = [<><b>{i.no}</b> · {d.title}</>, `Amount: ${inr(i.total)}`];
  // runs when the dialog is confirmed. Nothing is saved yet: this only shows the message.
  const done = (text) => async (values) => {
    await doAction(i.id, 'preview', values);
    toast(text(values.target));
  };
  const nameOf = (target) => pickable.current.find((p) => p.id === target)?.name || 'the selected person';

  async function press(kind) {
    if (kind === 'fill') return navigate(`/indents/${i.id}/fill/${st.fillSection}`);
    if (kind === 'approve' && st.approve.generate) {
      return setDialog({
        title: 'Generate purchase order', lines: [...summary, 'A purchase order number is created and the indent is completed.'],
        btn: 'Generate PO', gold: true, remPh: 'Optional note for the record.', onSubmit: done(() => 'Purchase order generated (preview only)'),
      });
    }
    if (kind === 'approve') {
      const t = await getTargets(i.id, 'approve');
      pickable.current = t.groups.flatMap((g) => g.people);
      return setDialog({
        title: st.approve.title, lines: summary, heading: 'Send to', groups: t.groups, prefer: t.prefer, btn: st.approve.label || 'Approve',
        gold: true, onSubmit: done((target) => `Sent to ${nameOf(target)} (preview only)`),
      });
    }
    if (kind === 'forward') {
      const t = await getTargets(i.id, 'forward');
      pickable.current = t.groups.flatMap((g) => g.people);
      return setDialog({
        title: 'Forward', lines: [...summary, 'They can fill their section or pass it further down. It comes back to you.'],
        heading: 'Forward to', groups: t.groups, prefer: t.prefer, btn: 'Forward', onSubmit: done((target) => `Forwarded to ${nameOf(target)} (preview only)`),
      });
    }
    if (kind === 'revise') {
      const t = await getTargets(i.id, 'revise');
      pickable.current = t.groups.flatMap((g) => g.people);
      return setDialog({
        title: 'Revise: send back for correction', lines: summary, heading: 'Send back to anyone earlier in the path', groups: t.groups,
        needRem: true, remErr: 'Tell them what to change.', remPh: 'What needs to be corrected?', btn: 'Send back',
        onSubmit: done((target) => `Sent back to ${nameOf(target)} (preview only)`),
      });
    }
    if (kind === 'reject') {
      return setDialog({
        title: 'Reject this indent', lines: [...summary, 'The indenter will see the rejection and your reason.'],
        needRem: true, remErr: 'Give the reason for rejecting.', remPh: 'Why is this indent rejected?', danger: true, btn: 'Reject',
        onSubmit: done(() => 'Indent rejected (preview only)'),
      });
    }
  }

  // what the box on the right shows depends on the stage and on who is looking
  function panel() {
    if (i.stage === 'DONE') {
      return (
        <div className="card pad">
          <Chip tone="solidgreen">Approved</Chip>
          <h3 className="mt8">Purchase order {i.po} created</h3>
          <p className="muted small">The final record has every section and signature.</p>
        </div>
      );
    }
    if (i.stage === 'CANCELLED') {
      return (
        <div className="card pad">
          <Chip tone="cancel">Cancelled</Chip>
          <p className="small mt8"><b>{i.people[i.cancel.by].name}</b> cancelled this indent on {fmt(i.cancel.t)}.</p>
          <div className="rem">{i.cancel.reason}</div>
        </div>
      );
    }
    if (i.stage === 'REJECTED') {
      return (
        <div className="card pad">
          <Chip tone="red">Rejected</Chip>
          <p className="small muted mt8">This indent was rejected. The form is no longer available.</p>
        </div>
      );
    }
    if (i.holder !== user.id) {
      return (
        <div className="card wait">
          <div className="row" style={{ gap: 14 }}>
            <div className="av y">{initials(holder.name)}</div>
            <div>
              <div className="xs muted">Waiting for</div>
              <b>{holder.name}</b>
              <div className="small muted">{holder.desig}</div>
              <div className="small">{holder.email}</div>
            </div>
          </div>
          <div className="alert info mt16">
            <Icon name="clock" size={18} />
            <span>{user.tiers.includes('ind') ? 'You will see it here when it moves.' : 'You can act only on indents that are with you.'}</span>
          </div>
        </div>
      );
    }
    if (i.stage === 'RETURNED' || i.stage === 'DRAFT') {
      const last = [...i.history].reverse().find((h) => h.type === 'o');
      return (
        <div className="card ap">
          <div className="ah"><h3>{i.stage === 'DRAFT' ? 'Finish your draft' : 'Fix and send again'}</h3></div>
          <div className="ab">
            {last && (
              <div className="alert warn">
                <Icon name="undo" size={18} />
                <span><b>{i.people[last.pid].name} sent this back.</b><br />{last.remark}</span>
              </div>
            )}
            <Button variant="gold" onClick={() => navigate(`/indents/${i.id}/edit`)}>Edit and resubmit</Button>
          </div>
        </div>
      );
    }

    // the five buttons. shared/workflow.js (buttonState) says which are on and why one is off
    const b = buttonState(i);
    const sec = st.fillSection;
    const filled = sec ? i.data[sec] : null;
    const btn = (key, variant, icon, label, extra = {}) => (
      <Button variant={variant} icon={icon} disabled={!b[key].on} title={b[key].on ? '' : b[key].why} onClick={() => press(key)} {...extra}>{label}</Button>
    );
    const hint = !b.approve.on ? `Approve turns on after you fill the ${SECTION_NAMES[sec]} section. Press Fill form to open it.` : '';

    return (
      <div className="card ap">
        <div className="ah">
          <h3>Your action</h3>
          <div className="xs" style={{ color: '#1E40AF' }}>{i.no} · {st.label}</div>
        </div>
        <div className="ab">
          {sec && (
            <div className={`sstat ${filled ? 'ok' : ''}`}>
              <span>{SECTION_NAMES[sec]} section</span>
              {filled ? <Chip tone="green">Filled by {i.people[filled.by].name.split(' ')[0]}</Chip> : <Chip tone="gray">Not filled</Chip>}
            </div>
          )}
          {btn('approve', 'gold', 'check', b.approve.label, { size: 'big' })}
          <div className="two">{btn('forward', 'sec', 'send', 'Forward')}{btn('fill', 'sec', 'edit', b.fill.label)}</div>
          <div className="two">{btn('revise', 'sec', 'undo', 'Revise')}{btn('reject', 'danger', 'x', 'Reject')}</div>
          {hint && <div className="alert info"><Icon name="info" size={18} /><span>{hint}</span></div>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="crumb"><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link> / {i.no}</div>

      <div className="card head">
        <div className="row wrap" style={{ gap: 8 }}><h1>{d.title}</h1><StatusChip stage={i.stage} /></div>
        <div className="muted mt8">{i.no} · {i.formCode}{i.gem ? ' · GeM purchase' : ''}</div>
        <div className="meta">
          <div><span>Indenter</span><b>{owner.name}</b><div className="xs">{owner.email}</div></div>
          <div><span>Amount</span><b className="tnum">{inr(i.total)}</b></div>
          <div>
            <span>Currently with</span>
            <b>{holder ? nameDesig(holder) : isDead(i) ? 'Closed' : 'Completed'}</b>
            {holder && <div className="xs">{holder.email}</div>}
          </div>
          <div><span>Last update</span><b>{fmt(i.updatedAt)}</b></div>
          {i.po && <div><span>Purchase order</span><b>{i.po}</b></div>}
        </div>
        <Stepper indent={i} />
      </div>

      <div className="cols">
        <div>
          <div className="cardtabs" role="tablist">
            {tabs.map(([k, label]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>)}
          </div>

          {tab === 'details' && (
            <>
              <SectionView section={section('indenter')} values={d} indent={i} ctx={ctx} />
              <SectionView section={section('accounts')} values={i.data.accounts} indent={i} ctx={ctx} />
              <SectionView section={section('purchase')} values={i.data.purchase} indent={i} ctx={ctx} />
              <SectionView section={section('final')} values={{}} indent={i} ctx={ctx} />
              {showPO && (
                <SectionView
                  section={section('po')} values={i.data.po} indent={i} ctx={ctx}
                  chip={i.po ? <Chip tone="solidgreen">{i.po}</Chip> : undefined}
                />
              )}
            </>
          )}
          {tab === 'docs' && <div className="card pad muted">Documents: coming soon.</div>}
          {tab === 'history' && <div className="card pad muted">History: coming soon.</div>}
        </div>

        <aside className="panel">{panel()}</aside>
      </div>

      {dialog && <PasswordDialog {...dialog} onClose={() => setDialog(null)} />}
      {message && <div className="toast"><Icon name="check" size={18} />{message}</div>}
    </>
  );
}
