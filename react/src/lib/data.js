// MyDR24 HOS — Mock data layer (shaped like production API responses)
// Figures align to the v5.0 reference document.
import { rnd, pick, inr } from './format';

export const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const exec = {
  businessHealth: 92, orgHealth: 88,
  mrr: 38400000, arr: 460800000,
  revenueToday: 6438000, revPerMin: 4472,
  burnRate: 21500000, runwayMonths: 18,
  ebitdaMargin: 23.4, grossMargin: 57.2,
  nrr: 112, ltvCac: 11.4, arpu: 912,
  slaCompliance: 91.4, uptime: 99.97, apiP99: 182,
  activePatients: 1284500, dau: 184200, mau: 612400,
  consultsMTD: 142800, emergenciesMTD: 4120, homeVisitsMTD: 38600, rpmActive: 9240,
};

export const revenueSeries = [21.2, 23.8, 25.1, 27.6, 29.9, 31.4, 32.8, 33.6, 35.1, 36.2, 37.5, 38.4];
export const forecastSeries = [38.4, 40.1, 42.6, 44.9, 47.2, 50.1];

export const serviceMix = [
  { label: 'Quick Consult', value: 38, color: '#1b7df5' },
  { label: 'Home Healthcare', value: 24, color: '#16ad8f' },
  { label: 'Emergency', value: 14, color: '#fb7185' },
  { label: 'RPM / Chronic', value: 13, color: '#8b5cf6' },
  { label: 'Diagnostics', value: 11, color: '#f59e0b' },
];

export const liveOps = {
  activeConsults: 140, consultsBreak: { video: 38, audio: 64, chat: 40 },
  activeHomeVisits: 90, homeBreak: { nursing: 21, icu: 12, care: 54 },
  activeEmergencies: 8, emgBreak: { crit: 3, high: 2, med: 3 },
  doctorsOnline: 312, doctorsOnCall: 64,
  caregiversAvailable: 248, caregiversEnRoute: 71,
  ambulancesReady: 86, ambulancesDeployed: 41,
  bedsAvailable: 847, bedsIcu: 92,
};

export const cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export const zonesGeo = [
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, demand: 'Surge', util: 88 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, demand: 'High', util: 81 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, demand: 'High', util: 76 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, demand: 'Moderate', util: 62 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, demand: 'Moderate', util: 58 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, demand: 'High', util: 74 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, demand: 'Low', util: 41 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, demand: 'Moderate', util: 55 },
];

const FIRSTS = ['Aarav', 'Vivaan', 'Aditya', 'Ananya', 'Diya', 'Ishaan', 'Kavya', 'Reyansh', 'Saanvi', 'Arjun', 'Myra', 'Vihaan', 'Anika', 'Kabir', 'Aadhya', 'Rohan', 'Priya', 'Neha', 'Rahul', 'Sneha', 'Karan', 'Pooja', 'Amit', 'Riya'];
const LASTS = ['Sharma', 'Verma', 'Iyer', 'Reddy', 'Patel', 'Nair', 'Gupta', 'Mehta', 'Singh', 'Rao', 'Kapoor', 'Bose', 'Khan', 'Das', 'Joshi', 'Menon', 'Pillai', 'Chopra'];
export const randomName = () => pick(FIRSTS) + ' ' + pick(LASTS);

const CLINICAL = ['Diabetes', 'Hypertension', 'Cardiac', 'Respiratory', 'Post-Surgical', 'Maternal', 'Paediatric', 'Mental Health'];
const RISK = ['High', 'Medium', 'Low'];
const PLANS = ['Platinum', 'Gold', 'Silver', 'Corporate', 'PMJAY', 'Pay-per-Consult'];
const BEHAV = ['Power User', 'Engaged', 'At-Risk', 'Dormant', 'New'];

export const patients = Array.from({ length: 60 }, (_, i) => {
  const name = randomName();
  return {
    id: 'PT-' + (10240 + i + 1), name,
    age: rnd(3, 84), gender: pick(['Male', 'Female']), city: pick(cities),
    abha: `${rnd(10, 99)}-${rnd(1000, 9999)}-${rnd(1000, 9999)}`,
    condition: pick(CLINICAL), risk: pick(RISK), plan: pick(PLANS), behavior: pick(BEHAV),
    healthScore: rnd(42, 98), churn: rnd(4, 88), emgScore: rnd(2, 95),
    ltv: rnd(8, 240) * 1000, lastVisit: rnd(0, 60) + 'd ago', rpm: Math.random() > 0.6,
  };
});

const SPECIALTIES = ['Cardiology', 'General Medicine', 'Paediatrics', 'Orthopaedics', 'Dermatology', 'Gynaecology', 'Neurology', 'Psychiatry', 'ENT', 'Pulmonology'];
export const doctors = Array.from({ length: 40 }, (_, j) => {
  const name = 'Dr. ' + randomName();
  return {
    id: 'DR-' + (5300 + j + 1), name, specialty: pick(SPECIALTIES), city: pick(cities),
    status: pick(['Online', 'Online', 'On Call', 'Offline']), verified: Math.random() > 0.15,
    rating: (rnd(38, 50) / 10).toFixed(1), nps: rnd(38, 82),
    consults: rnd(120, 4200), utilisation: rnd(48, 94),
    qualityScore: rnd(72, 97), commission: rnd(50, 70),
    revenue: rnd(80, 1400) * 1000, tier: pick(['Gold', 'Silver', 'Standard']),
  };
});

const SKILLS = ['General Nursing', 'ICU Care', 'Elderly Care', 'Paediatric', 'Physiotherapy', 'Post-Surgical'];
const CG_STATUS = ['Available', 'En Route', 'On Visit', 'Off Shift'];
export const caregivers = Array.from({ length: 48 }, (_, k) => ({
  id: 'CG-' + (8800 + k + 1), name: randomName(), skill: pick(SKILLS), city: pick(cities),
  status: pick(CG_STATUS), rating: (rnd(40, 50) / 10).toFixed(1),
  onTime: rnd(84, 99), visitsToday: rnd(0, 8), visitsMonth: rnd(40, 180),
  battery: rnd(12, 100), burnout: rnd(8, 78), tenure: rnd(1, 36),
  lat: 28.4 + Math.random() * 0.5, lng: 77.0 + Math.random() * 0.5,
}));

const EMG_TYPES = ['Cardiac', 'Trauma', 'Obstetric', 'Paediatric', 'Respiratory', 'Stroke'];
const EMG_STATUS = ['En Route', 'On Scene', 'Dispatched', 'Returning'];
export const emergencies = Array.from({ length: 14 }, (_, e) => ({
  id: 'EMG-' + (74100 + e + 1), type: pick(EMG_TYPES), priority: pick(['P1', 'P1', 'P2', 'P3']),
  status: pick(EMG_STATUS), zone: pick(cities), patient: randomName(),
  ambulance: 'AMB-' + rnd(100, 999), eta: rnd(2, 18) + ' min', triageSec: rnd(4, 10),
  lat: 28.4 + Math.random() * 0.55, lng: 76.95 + Math.random() * 0.6, sla: Math.random() > 0.12,
}));

export const hospitals = cities.slice(0, 8).map((c) => ({
  name: pick(['Apollo', 'Fortis', 'Max', 'Manipal', 'Medanta', 'AIIMS', 'Narayana', 'KIMS']) + ' · ' + c,
  city: c, general: rnd(20, 180), icu: rnd(2, 28), nicu: rnd(0, 14), ventilators: rnd(1, 20), occupancy: rnd(52, 96),
}));

const LEAD_SRC = ['Website', 'WhatsApp', 'Phone', 'IVR', 'Referral', 'Google Ads', 'Facebook Ads', 'Corporate'];
const LEAD_STAGE = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'];
export const leads = Array.from({ length: 50 }, (_, l) => ({
  id: 'LD-' + (3100 + l + 1), name: randomName(), source: pick(LEAD_SRC), stage: pick(LEAD_STAGE),
  score: rnd(20, 98), value: rnd(2, 90) * 1000, owner: randomName(), city: pick(cities), created: rnd(0, 30) + 'd ago',
}));

export const pipelineSeed = {
  'Lead In': [
    { id: 'OPP-401', org: 'TCS Wellness', value: 2400000, owner: 'Priya Nair', tag: 'Corporate' },
    { id: 'OPP-402', org: 'Sunrise Hospitals', value: 1850000, owner: 'Rohan Das', tag: 'Hospital' },
    { id: 'OPP-403', org: 'Star Health Insurance', value: 5600000, owner: 'Neha Gupta', tag: 'Insurance' },
  ],
  Qualified: [
    { id: 'OPP-388', org: 'Infosys BPM', value: 3200000, owner: 'Karan Mehta', tag: 'Corporate' },
    { id: 'OPP-390', org: 'CareNest Pune', value: 980000, owner: 'Amit Singh', tag: 'Franchise' },
  ],
  Proposal: [
    { id: 'OPP-371', org: 'Govt. of Rajasthan · PMJAY', value: 12500000, owner: 'Sneha Rao', tag: 'Government' },
    { id: 'OPP-375', org: 'Reliance Foundation', value: 4100000, owner: 'Priya Nair', tag: 'Corporate' },
  ],
  Negotiation: [{ id: 'OPP-352', org: 'Wipro Health', value: 6700000, owner: 'Rohan Das', tag: 'Corporate' }],
  Won: [
    { id: 'OPP-340', org: 'Apollo Care Hub', value: 8900000, owner: 'Neha Gupta', tag: 'Hospital' },
    { id: 'OPP-333', org: 'HDFC Ergo', value: 5400000, owner: 'Karan Mehta', tag: 'Insurance' },
  ],
};

export const aiModels = [
  { name: 'Emergency Demand Predictor', kpi: 'MAE Accuracy', perf: 86, unit: '%', retrain: 'Monthly', status: 'Healthy' },
  { name: 'Patient Deterioration Model', kpi: 'Precision / Recall', perf: 87, sub: '91% recall', unit: '%', retrain: 'Quarterly', status: 'Healthy' },
  { name: 'Churn Prediction Engine', kpi: 'Precision @ CPI>65', perf: 89, unit: '%', retrain: 'Monthly', status: 'Healthy' },
  { name: 'Disease Outbreak Detector', kpi: 'Advance Warning', perf: 72, unit: 'hr', retrain: 'Continuous', status: 'Healthy' },
  { name: 'Prescription Anomaly Detector', kpi: 'Recall', perf: 92, sub: '<1% FP', unit: '%', retrain: 'Monthly', status: 'Healthy' },
  { name: 'Fraud Detection System', kpi: 'False Positive Rate', perf: 99.8, sub: '<0.2% FP', unit: '%', retrain: 'Weekly', status: 'Healthy' },
  { name: 'AI Clinical Quality Scorer', kpi: 'CMO Audit Agreement', perf: 88, unit: '%', retrain: 'Quarterly', status: 'Monitoring' },
  { name: 'Revenue Forecast (30-day)', kpi: 'Accuracy', perf: 94, unit: '%', retrain: 'Quarterly', status: 'Healthy' },
  { name: 'Smart Dispatch Engine', kpi: 'Decision Latency', perf: 60, unit: 'sec', retrain: 'Continuous', status: 'Healthy' },
];

export const compliance = [
  { fw: 'DPDP Act 2023', region: 'India', status: 'Compliant', score: 98, controls: 'Consent-first, data localisation, DPO, 72-hr grievance' },
  { fw: 'ABDM / NDHM', region: 'India', status: 'Compliant', score: 96, controls: 'ABHA-linked, FHIR R4, HIU/HIP NHA' },
  { fw: 'NABH Telemedicine', region: 'India', status: 'Compliant', score: 94, controls: 'TPG 2020 protocols' },
  { fw: 'HIPAA', region: 'USA / Global', status: 'Compliant', score: 97, controls: 'PHI classification, BAA, breach <60h' },
  { fw: 'GDPR', region: 'EU', status: 'Compliant', score: 95, controls: 'Subject rights, consent, DPA' },
  { fw: 'ISO 27001', region: 'Global', status: 'Audit Due', score: 91, controls: 'ISMS, pentest, incident SLA' },
];

export const notifications = [
  { icon: 'fa-truck-medical', color: '#fb7185', title: 'P1 Emergency · Cardiac', text: 'Delhi NCR · ambulance dispatched in 58s', time: '2m' },
  { icon: 'fa-triangle-exclamation', color: '#f59e0b', title: 'SLA breach risk', text: 'Mumbai zone caregiver coverage at 68%', time: '11m' },
  { icon: 'fa-heart-pulse', color: '#ef4444', title: 'RPM critical alert', text: 'PT-10293 SpO2 dropped to 86%', time: '18m' },
  { icon: 'fa-coins', color: '#16ad8f', title: 'Revenue milestone', text: 'MRR crossed ₹3.84 Cr this month', time: '1h' },
  { icon: 'fa-shield-halved', color: '#1b7df5', title: 'Security: all clear', text: 'SOC scan complete · 0 P1 incidents', time: '3h' },
];

const FEED_TEMPLATES = [
  { type: 'Emergency Dispatched', icon: 'fa-truck-medical', color: '#fb7185', make: () => `EMG-${rnd(74100, 74200)} · ${pick(EMG_TYPES)} · ${pick(cities)} · ETA ${rnd(3, 14)} min` },
  { type: 'Appointment Booked', icon: 'fa-calendar-check', color: '#1b7df5', make: () => `${randomName()} → Dr. ${pick(LASTS)} · ${pick(SPECIALTIES)}` },
  { type: 'Referral Converted', icon: 'fa-share-nodes', color: '#16ad8f', make: () => `REF-${rnd(900, 999)} · ${inr(rnd(800, 4000) * 10)}` },
  { type: 'New Patient', icon: 'fa-user-plus', color: '#8b5cf6', make: () => `${randomName()} · via ${pick(LEAD_SRC)}` },
  { type: 'Caregiver Check-In', icon: 'fa-location-dot', color: '#0ea5e9', make: () => `${randomName()} @ residence (geofence)` },
  { type: 'RPM Alert', icon: 'fa-heart-pulse', color: '#ef4444', make: () => `${randomName()} · ${pick(['SpO2 88%', 'BP 168/102', 'Glucose 312', 'HR 128'])} · High` },
  { type: 'Subscription', icon: 'fa-crown', color: '#f59e0b', make: () => `${pick(PLANS)} plan · ${inr(rnd(99, 999) * 10)}` },
];
export function makeFeed(n = 8) {
  return Array.from({ length: n }, () => {
    const t = pick(FEED_TEMPLATES);
    return { type: t.type, icon: t.icon, color: t.color, text: t.make(), time: rnd(1, 59) + 's ago' };
  });
}
