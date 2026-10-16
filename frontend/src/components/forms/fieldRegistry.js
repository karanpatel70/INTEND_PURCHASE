// Owner: Rahul. Maps a field "type" (from the form JSON) to the component that draws it.
// A NEW field type = one new file in fields/ + one line here. Nothing else changes.
import TextField from './fields/TextField.jsx';
import NumberField from './fields/NumberField.jsx';
import TextAreaField from './fields/TextAreaField.jsx';
import SelectField from './fields/SelectField.jsx';
import RadioField from './fields/RadioField.jsx';
import CheckboxesField from './fields/CheckboxesField.jsx';
import CheckboxField from './fields/CheckboxField.jsx';
import DateField from './fields/DateField.jsx';
import ItemsTable from './fields/ItemsTable.jsx';
import FileField from './fields/FileField.jsx';
import DisplayField from './fields/DisplayField.jsx';

export const fieldRegistry = {
  text: TextField,
  number: NumberField,
  textarea: TextAreaField,
  select: SelectField,
  radio: RadioField,
  checkboxes: CheckboxesField,
  checkbox: CheckboxField,
  date: DateField,
  'items-table': ItemsTable,
  file: FileField,
  display: DisplayField,
};
