// MyDR24 HOS — formatting & small data utilities (pure functions)

export function inr(n) {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
  if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + 'K';
  return '₹' + n;
}

export const num = (n) => Number(n).toLocaleString('en-IN');

export const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = (a) => a[rnd(0, a.length - 1)];

export const initials = (name) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const AVATAR_COLORS = ['#1b7df5', '#16ad8f', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#22c55e', '#ec4899'];
export function colorFor(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  return AVATAR_COLORS[s % AVATAR_COLORS.length];
}

// Map a status/label to a badge variant
const STATUS_MAP = {
  Online: 'green', Available: 'green', Compliant: 'green', Won: 'green', Healthy: 'green', Active: 'green', Paid: 'green', Stable: 'green', Confirmed: 'green',
  'On Call': 'blue', 'En Route': 'blue', Contacted: 'blue', Dispatched: 'blue', Monitoring: 'blue', P3: 'blue',
  'On Visit': 'violet', 'On Scene': 'violet', Qualified: 'violet', Proposal: 'violet', Platinum: 'violet',
  Offline: 'slate', 'Off Shift': 'slate', Dormant: 'slate', New: 'slate', Returning: 'slate', Silver: 'slate',
  'At-Risk': 'amber', 'Audit Due': 'amber', Negotiation: 'amber', Medium: 'amber', Pending: 'amber', Paused: 'amber', P2: 'amber', Gold: 'amber',
  P1: 'red', High: 'red', Critical: 'red', Lost: 'red', Refunded: 'violet',
  Low: 'green',
};
export const statusVariant = (s) => STATUS_MAP[s] || 'slate';
