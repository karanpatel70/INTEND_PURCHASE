import { progressSteps, stepCurrent } from '@shared/workflow.js';
import Icon from './Icon.jsx';


export default function Stepper({ indent }) {
  const cur = stepCurrent(indent);
  const holderName = indent.holder ? indent.people[indent.holder].name.replace(/^(Dr\.|Prof\.)\s*/, '') : '';
  return (
    <div className="stepper" role="list">
      {progressSteps.map((label, k) => {
        let cls = k < cur ? 'done' : k === cur ? 'cur' : '';
        if (k === cur && indent.stage === 'RETURNED') cls = 'cur warn';
        if (k === cur && (indent.stage === 'REJECTED' || indent.stage === 'CANCELLED')) cls = 'cur bad';
        const sub = k === cur ? holderName : k === 5 && indent.po ? indent.po : '';
        return (
          <div key={label} className={`step ${cls}`} role="listitem">
            <div className="c">{cls.includes('done') ? <Icon name="check" size={14} /> : cls.includes('bad') ? <Icon name="x" size={14} /> : k + 1}</div>
            {label}
            <small>{sub}</small>
          </div>
        );
      })}
    </div>
  );
}
