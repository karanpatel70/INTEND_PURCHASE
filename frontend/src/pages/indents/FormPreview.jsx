import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getIndent } from '../../api/indents.js';
import { useFormTemplate } from '../../hooks/useFormTemplate.js';
import { printRegistry } from '../../components/print/printRegistry.js';
import GenericPrint, { PODocument } from '../../components/print/GenericPrint.jsx';
import Button from '../../components/ui/Button.jsx';

// Full-screen preview of the form (or the purchase order with ?kind=po). Print or save as PDF.
// A rejected or cancelled indent cannot be previewed or printed.
export default function FormPreview() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isPO = params.get('kind') === 'po';
  const navigate = useNavigate();
  const [indent, setIndent] = useState(null);
  const template = useFormTemplate(indent && indent.formCode);

  useEffect(() => {
    getIndent(id).then((i) => {
      if (i.stage === 'REJECTED' || i.stage === 'CANCELLED' || (isPO && !i.data.po)) {
        navigate(`/indents/${id}`, { replace: true, state: { toast: isPO && !i.data.po ? 'There is no purchase order for this indent yet.' : `This indent was ${i.stage.toLowerCase()}. Its form cannot be printed.` } });
      } else setIndent(i);
    }).catch(() => navigate('/', { replace: true }));
  }, [id]);

  // the page size for printing: A4 for the purchase order, Letter for the form
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@page{size:${isPO ? 'A4' : 'letter'};margin:12mm}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [isPO]);

  if (!indent || !template) return null;
  const Layout = printRegistry[template.printLayout]; // a special layout, if one exists. Otherwise GenericPrint.
  const zoom = Math.min(1, (window.innerWidth - 28) / 820).toFixed(3);

  return (
    <div className="ov doc">
      <div className="dochead noprint">
        <b>
          {isPO ? 'Purchase order' : indent.stage === 'DONE' ? 'Final record' : 'Form preview'}: {indent.no}
          {isPO && indent.po ? ' · ' + indent.po : ''}
        </b>
        <div className="row">
          <Button variant="gold" size="sm" icon="print" onClick={() => window.print()}>Print or save as PDF</Button>
          <Button variant="sec" size="sm" icon="x" onClick={() => navigate(`/indents/${id}`)}>Close</Button>
        </div>
      </div>
      <div className="docwrap" style={{ zoom }}>
        {isPO ? <PODocument indent={indent} /> : Layout ? <Layout indent={indent} /> : <GenericPrint template={template} indent={indent} />}
      </div>
    </div>
  );
}
