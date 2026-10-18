// Owner: Rahul. Price limits per form. A limit is never edited: a new row with a later effectiveFrom replaces it.
export const limits = [
  { formCode: 'SPS-101', rule: 'non-GeM', amount: 100000, effectiveFrom: '2024-04-01' },
  { formCode: 'SPS-101', rule: 'GeM', amount: 50000, effectiveFrom: '2024-04-01' },
  { formCode: 'SPS-101(R)', rule: 'all', amount: 200000, effectiveFrom: '2024-04-01' },
];
