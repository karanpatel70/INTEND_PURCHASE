// Used by BOTH frontend and backend. Which roles exist, and what they are called.
// A user has "tiers" (what they may do). AR, DR and JR are ONE role: only the designation text differs.

export const ROLES = {
  ind: { label: 'Indenter', tiers: ['ind'] },
  hod: { label: 'HOD', tiers: ['hod', 'final'] },
  a_top: { label: 'Accounts: AR/DR/JR', tiers: ['a_top'] },
  a_mid: { label: 'Accounts: JAO/AO', tiers: ['a_mid'] },
  a_low: { label: 'Accounts: JAA/SAA', tiers: ['a_low'] },
  p_top: { label: 'Purchase: AR/DR/JR', tiers: ['p_top'] },
  p_mid: { label: 'Purchase: JS/Supdt.', tiers: ['p_mid'] },
  p_low: { label: 'Purchase: OA/JA/SA', tiers: ['p_low'] },
  reg: { label: 'Registrar (approving authority)', tiers: ['final'] },
  admin: { label: 'Admin', tiers: ['admin'] },
  none: { label: 'Not assigned', tiers: [] },
};

export const roleOf = (u) =>
  u.tiers.includes('admin') ? 'admin'
  : u.tiers.includes('hod') ? 'hod'
  : u.tiers.includes('final') ? 'reg'
  : u.tiers[0] || 'none';

export const roleLabel = (u) => ROLES[roleOf(u)].label;
export const isAdmin = (u) => !!u && u.tiers.includes('admin');
export const isIndenterOnly = (u) => u.tiers.length > 0 && u.tiers.every((t) => t === 'ind');
export const isPurchase = (u) => !!u && u.tiers.some((t) => t[0] === 'p');
export const isAccounts = (u) => !!u && u.tiers.some((t) => t[0] === 'a');
export const canSeeOrders = (u) => !!u && !isAdmin(u) && (isPurchase(u) || u.tiers.includes('ind'));

// "Dr. Ananya Sharma, Assistant Professor, CSE"
export const nameDesig = (p) => p.name + (p.desig ? ', ' + p.desig : '');
export const initials = (n) =>
  n.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map((x) => x[0]).slice(0, 2).join('');
// part before @iitrpr.ac.in
export const emailLocal = (s) => String(s || '').split('@')[0];

export const ROLE_ORDER = [
  'Admin', 'Registrar (approving authority)', 'HOD', 'Indenter', 'Accounts: AR/DR/JR', 'Accounts: JAO/AO',
  'Accounts: JAA/SAA', 'Purchase: AR/DR/JR', 'Purchase: JS/Supdt.', 'Purchase: OA/JA/SA', 'Not assigned',
];
