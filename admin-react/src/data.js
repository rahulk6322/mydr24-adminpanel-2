// MyDR24 Admin — mock data (shaped like API responses)
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rnd(0, arr.length - 1)];

const FIRST = ['Aarav', 'Ananya', 'Diya', 'Ishaan', 'Kavya', 'Reyansh', 'Saanvi', 'Arjun', 'Myra', 'Vihaan', 'Priya', 'Neha', 'Rahul', 'Sneha', 'Karan', 'Pooja', 'Amit', 'Riya', 'Rohan', 'Anjali'];
const LAST = ['Sharma', 'Verma', 'Iyer', 'Reddy', 'Patel', 'Nair', 'Gupta', 'Mehta', 'Singh', 'Rao', 'Kapoor', 'Das', 'Khan', 'Joshi', 'Menon'];
export const name = () => `${pick(FIRST)} ${pick(LAST)}`;
export const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const COLORS = ['#1b7df5', '#16ad8f', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#22c55e', '#ec4899'];
export const color = (seed) => { let s = 0; for (const c of seed) s += c.charCodeAt(0); return COLORS[s % COLORS.length]; };
export const inr = (n) => (n >= 1e7 ? '₹' + (n / 1e7).toFixed(2) + ' Cr' : n >= 1e5 ? '₹' + (n / 1e5).toFixed(2) + ' L' : n >= 1e3 ? '₹' + (n / 1e3).toFixed(1) + 'K' : '₹' + n);
export const num = (n) => n.toLocaleString('en-IN');

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const kpis = {
  patients: 18420, doctors: 342, appointmentsToday: 286, revenueMonth: 12840000,
  occupancy: 78, satisfaction: 4.6, avgWait: 12, emergencies: 9,
};

export const revenueSeries = months.map((m, i) => ({
  month: m,
  revenue: 6 + i * 0.6 + Math.random() * 1.2,
  expense: 4 + i * 0.4 + Math.random() * 0.8,
}));

export const appointmentsByDept = [
  { name: 'Cardiology', value: 320, color: '#1b7df5' },
  { name: 'Orthopaedics', value: 240, color: '#16ad8f' },
  { name: 'Paediatrics', value: 210, color: '#8b5cf6' },
  { name: 'Neurology', value: 160, color: '#f59e0b' },
  { name: 'Dermatology', value: 140, color: '#0ea5e9' },
  { name: 'General', value: 280, color: '#ec4899' },
];

export const weeklyVisits = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({
  day: d, walkIn: rnd(40, 120), online: rnd(60, 180),
}));

const CONDITIONS = ['Diabetes', 'Hypertension', 'Cardiac', 'Respiratory', 'Post-Surgical', 'Maternal', 'Fracture', 'Fever'];
const STATUS = ['Admitted', 'Out-patient', 'Discharged', 'Critical'];
const PLANS = ['Premium', 'Standard', 'Basic', 'Insurance'];
export const patients = Array.from({ length: 40 }, (_, i) => {
  const n = name();
  return {
    id: 'PT-' + (1001 + i), name: n, age: rnd(2, 86), gender: pick(['Male', 'Female']),
    condition: pick(CONDITIONS), status: pick(STATUS), plan: pick(PLANS),
    doctor: 'Dr. ' + pick(LAST), lastVisit: rnd(0, 60) + 'd ago', bill: rnd(2, 180) * 1000,
  };
});

const SPECIALTY = ['Cardiology', 'Orthopaedics', 'Paediatrics', 'Neurology', 'Dermatology', 'Gynaecology', 'General Medicine', 'ENT'];
export const doctors = Array.from({ length: 28 }, (_, i) => {
  const n = 'Dr. ' + name();
  return {
    id: 'DR-' + (501 + i), name: n, specialty: pick(SPECIALTY),
    status: pick(['Available', 'In Surgery', 'On Leave', 'Available']),
    patientsToday: rnd(0, 24), rating: (rnd(40, 50) / 10).toFixed(1),
    experience: rnd(2, 28) + ' yrs', fee: rnd(3, 15) * 100,
  };
});

const APPT_STATUS = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
const APPT_TYPE = ['Consultation', 'Follow-up', 'Surgery', 'Diagnostic', 'Vaccination'];
export const appointments = Array.from({ length: 30 }, (_, i) => ({
  id: 'AP-' + (9001 + i), patient: name(), doctor: 'Dr. ' + pick(LAST),
  dept: pick(SPECIALTY), type: pick(APPT_TYPE), status: pick(APPT_STATUS),
  time: `${rnd(9, 18)}:${pick(['00', '15', '30', '45'])}`, date: 'Today',
}));

export const departments = [
  { name: 'Cardiology', head: 'Dr. ' + pick(LAST), beds: 48, occupied: 39, staff: 32, icon: 'fa-heart-pulse', color: '#ef4444' },
  { name: 'Orthopaedics', head: 'Dr. ' + pick(LAST), beds: 36, occupied: 24, staff: 26, icon: 'fa-bone', color: '#16ad8f' },
  { name: 'Paediatrics', head: 'Dr. ' + pick(LAST), beds: 40, occupied: 31, staff: 28, icon: 'fa-baby', color: '#8b5cf6' },
  { name: 'Neurology', head: 'Dr. ' + pick(LAST), beds: 24, occupied: 19, staff: 22, icon: 'fa-brain', color: '#1b7df5' },
  { name: 'Emergency', head: 'Dr. ' + pick(LAST), beds: 30, occupied: 27, staff: 40, icon: 'fa-truck-medical', color: '#f59e0b' },
  { name: 'Maternity', head: 'Dr. ' + pick(LAST), beds: 28, occupied: 18, staff: 24, icon: 'fa-person-pregnant', color: '#ec4899' },
];

const MED_CAT = ['Antibiotic', 'Analgesic', 'Cardiac', 'Diabetic', 'Vaccine', 'Surgical'];
export const pharmacy = Array.from({ length: 24 }, (_, i) => {
  const stock = rnd(0, 800);
  return {
    id: 'MED-' + (2001 + i),
    drug: pick(['Amoxicillin', 'Paracetamol', 'Metformin', 'Atorvastatin', 'Insulin', 'Ibuprofen', 'Omeprazole', 'Azithromycin']) + ' ' + pick(['250mg', '500mg', '40mg', '10mg']),
    category: pick(MED_CAT), stock, reorder: 150, price: rnd(10, 900),
    status: stock === 0 ? 'Out of Stock' : stock < 150 ? 'Low' : 'In Stock',
  };
});

export const activity = [
  { icon: 'fa-user-plus', color: '#8b5cf6', text: 'New patient registered · ' + name(), time: '2m ago' },
  { icon: 'fa-calendar-check', color: '#1b7df5', text: 'Appointment confirmed · Dr. ' + pick(LAST), time: '8m ago' },
  { icon: 'fa-truck-medical', color: '#ef4444', text: 'Emergency admission · Cardiology', time: '15m ago' },
  { icon: 'fa-flask', color: '#f59e0b', text: 'Lab report ready · ' + name(), time: '23m ago' },
  { icon: 'fa-indian-rupee-sign', color: '#16ad8f', text: 'Payment received · ' + inr(rnd(2, 40) * 1000), time: '34m ago' },
  { icon: 'fa-prescription-bottle-medical', color: '#0ea5e9', text: 'Pharmacy stock updated · Insulin', time: '51m ago' },
];
