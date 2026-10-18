import { useEffect, useState } from 'react';
import { getForm, getForms } from '../api/forms.js';

// Owner: Rahul. useFormTemplates() = all forms for the dropdown.  useFormTemplate(code) = one form.
export function useFormTemplates() {
  const [forms, setForms] = useState([]);
  useEffect(() => {
    getForms().then(setForms).catch(() => {});
  }, []);
  return forms;
}

export function useFormTemplate(code) {
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    if (!code) return;
    getForm(code).then(setTemplate).catch(() => setTemplate(null));
  }, [code]);
  return template;
}
