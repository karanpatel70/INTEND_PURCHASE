// Used by BOTH frontend and backend. Reads shared/workflows/standard.json and answers questions like
// "which buttons are on for this indent?". Keep it free of any UI code.
import workflow from './workflows/standard.json' with { type: 'json' };

export const stages = workflow.stages;
export const progressSteps = workflow.progress;
export const tierLabels = workflow.tierLabels;
export const resetPoints = workflow.resetPoints;

export const stageInfo = (stage) => stages[stage];
export const isOpen = (i) => !['DONE', 'REJECTED', 'CANCELLED'].includes(i.stage);
export const isDead = (i) => i.stage === 'REJECTED' || i.stage === 'CANCELLED';

// Which progress step is the indent on? (rejected or cancelled indents remember where they stopped)
export const stepCurrent = (i) =>
  i.stage === 'REJECTED' ? i.rejIdx : i.stage === 'CANCELLED' ? i.cancelIdx : stages[i.stage].step;

export const SECTION_NAMES = { accounts: 'Accounts', purchase: 'Purchase', po: 'Purchase order' };

// The five buttons are always shown. This says which are on, and why one is off.
export function buttonState(indent) {
  const st = stages[indent.stage];
  const sec = st.fillSection;
  const filled = sec ? !!indent.data[sec] : true;
  const approve = st.approve || {};
  const label = approve.generate ? 'Generate PO' : approve.label || 'Approve';
  return {
    approve: { label, on: filled, why: filled ? '' : `Fill the ${SECTION_NAMES[sec]} section first.` },
    forward: {
      on: !!st.forward && !filled,
      why: !st.forward
        ? indent.stage === 'HOD' || indent.stage === 'FINAL'
          ? 'Use Approve to choose who gets it next.'
          : 'No one below you in this section.'
        : filled ? 'The section is already filled. Approve it instead.' : '',
    },
    fill: { label: filled ? 'Edit form' : 'Fill form', on: !!sec, why: sec ? '' : 'There is nothing for you to fill at this step.' },
    revise: { on: true, why: '' },
    reject: { on: !st.noReject, why: st.noReject ? 'This indent is already approved.' : '' },
  };
}

// When someone forwards to a tier, which stage does the indent go to?
export const stageForTier = (section, tier) =>
  Object.keys(stages).find((k) => stages[k].fillSection === section && stages[k].tier === tier);
