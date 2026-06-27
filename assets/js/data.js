/* ==========================================================================
   MyDR24 HOS — Mock Data Layer
   Realistic enterprise data aligned to the v5.0 reference figures.
   ========================================================================== */
(function (App) {
  'use strict';
  var D = App.data = {};

  /* ---- helpers ---- */
  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(a) { return a[rnd(0, a.length - 1)]; }
  D.rnd = rnd; D.pick = pick;

  D.inr = function (n) {
    if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + ' L';
    if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1) + 'K';
    return '₹' + n;
  };
  D.num = function (n) { return n.toLocaleString('en-IN'); };

  /* ---- Months for charts ---- */
  D.months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  /* ---- Executive KPIs (from v5.0 reference) ---- */
  D.exec = {
    businessHealth: 92,
    orgHealth: 88,
    mrr: 38400000, arr: 460800000,
    revenueToday: 6438000,
    revPerMin: 4472,
    burnRate: 21500000, runwayMonths: 18,
    ebitdaMargin: 23.4, grossMargin: 57.2,
    nrr: 112, ltvCac: 11.4, arpu: 912,
    slaCompliance: 91.4, uptime: 99.97, apiP99: 182,
    activePatients: 1284500, dau: 184200, mau: 612400,
    consultsMTD: 142800, emergenciesMTD: 4120, homeVisitsMTD: 38600, rpmActive: 9240,
  };

  D.revenueSeries = [21.2, 23.8, 25.1, 27.6, 29.9, 31.4, 32.8, 33.6, 35.1, 36.2, 37.5, 38.4]; // MRR ₹M
  D.forecastSeries = [38.4, 40.1, 42.6, 44.9, 47.2, 50.1]; // next 6 months
  D.serviceMix = [
    { label: 'Quick Consult', value: 38, color: '#1b7df5' },
    { label: 'Home Healthcare', value: 24, color: '#16ad8f' },
    { label: 'Emergency', value: 14, color: '#fb7185' },
    { label: 'RPM / Chronic', value: 13, color: '#8b5cf6' },
    { label: 'Diagnostics', value: 11, color: '#f59e0b' },
  ];

  /* ---- Live ops snapshot (sec 5 of reference) ---- */
  D.liveOps = {
    activeConsults: 140, consultsBreak: { video: 38, audio: 64, chat: 40 },
    activeHomeVisits: 90, homeBreak: { nursing: 21, icu: 12, care: 54 },
    activeEmergencies: 8, emgBreak: { crit: 3, high: 2, med: 3 },
    doctorsOnline: 312, doctorsOnCall: 64,
    caregiversAvailable: 248, caregiversEnRoute: 71,
    ambulancesReady: 86, ambulancesDeployed: 41,
    bedsAvailable: 847, bedsIcu: 92,
  };

  /* ---- Geography ---- */
  D.cities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  D.zonesGeo = [
    { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, demand: 'Surge', util: 88 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, demand: 'High', util: 81 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, demand: 'High', util: 76 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, demand: 'Moderate', util: 62 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, demand: 'Moderate', util: 58 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, demand: 'High', util: 74 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, demand: 'Low', util: 41 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, demand: 'Moderate', util: 55 },
  ];

  /* ---- Names ---- */
  var firsts = ['Aarav', 'Vivaan', 'Aditya', 'Ananya', 'Diya', 'Ishaan', 'Kavya', 'Reyansh', 'Saanvi', 'Arjun', 'Myra', 'Vihaan', 'Anika', 'Kabir', 'Aadhya', 'Rohan', 'Priya', 'Neha', 'Rahul', 'Sneha', 'Karan', 'Pooja', 'Amit', 'Riya'];
  var lasts = ['Sharma', 'Verma', 'Iyer', 'Reddy', 'Patel', 'Nair', 'Gupta', 'Mehta', 'Singh', 'Rao', 'Kapoor', 'Bose', 'Khan', 'Das', 'Joshi', 'Menon', 'Pillai', 'Chopra'];
  D.name = function () { return pick(firsts) + ' ' + pick(lasts); };
  D.initials = function (n) { return n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); };
  var avatarColors = ['#1b7df5', '#16ad8f', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9', '#22c55e', '#ec4899'];
  D.color = function (seed) { var s = 0; for (var i = 0; i < seed.length; i++) s += seed.charCodeAt(i); return avatarColors[s % avatarColors.length]; };

  /* ---- Patients ---- */
  var clinical = ['Diabetes', 'Hypertension', 'Cardiac', 'Respiratory', 'Post-Surgical', 'Maternal', 'Paediatric', 'Mental Health'];
  var riskTiers = ['High', 'Medium', 'Low'];
  var plans = ['Platinum', 'Gold', 'Silver', 'Corporate', 'PMJAY', 'Pay-per-Consult'];
  var behav = ['Power User', 'Engaged', 'At-Risk', 'Dormant', 'New'];
  D.patients = [];
  for (var i = 1; i <= 60; i++) {
    var nm = D.name();
    D.patients.push({
      id: 'PT-' + (10240 + i),
      name: nm,
      age: rnd(3, 84), gender: pick(['Male', 'Female']),
      city: pick(D.cities),
      abha: rnd(10, 99) + '-' + rnd(1000, 9999) + '-' + rnd(1000, 9999),
      condition: pick(clinical), risk: pick(riskTiers), plan: pick(plans), behavior: pick(behav),
      healthScore: rnd(42, 98), churn: rnd(4, 88), emgScore: rnd(2, 95),
      ltv: rnd(8, 240) * 1000, lastVisit: rnd(0, 60) + 'd ago', rpm: Math.random() > 0.7,
    });
  }

  /* ---- Doctors ---- */
  var specialties = ['Cardiology', 'General Medicine', 'Paediatrics', 'Orthopaedics', 'Dermatology', 'Gynaecology', 'Neurology', 'Psychiatry', 'ENT', 'Pulmonology'];
  D.doctors = [];
  for (var j = 1; j <= 40; j++) {
    var dn = 'Dr. ' + D.name();
    D.doctors.push({
      id: 'DR-' + (5300 + j),
      name: dn, specialty: pick(specialties), city: pick(D.cities),
      status: pick(['Online', 'Online', 'On Call', 'Offline']),
      verified: Math.random() > 0.15,
      rating: (rnd(38, 50) / 10).toFixed(1), nps: rnd(38, 82),
      consults: rnd(120, 4200), utilisation: rnd(48, 94),
      qualityScore: rnd(72, 97), commission: rnd(50, 70),
      revenue: rnd(80, 1400) * 1000, tier: pick(['Gold', 'Silver', 'Standard']),
    });
  }

  /* ---- Caregivers ---- */
  var skills = ['General Nursing', 'ICU Care', 'Elderly Care', 'Paediatric', 'Physiotherapy', 'Post-Surgical'];
  var cgStatus = ['Available', 'En Route', 'On Visit', 'Off Shift'];
  D.caregivers = [];
  for (var k = 1; k <= 48; k++) {
    var cn = D.name();
    D.caregivers.push({
      id: 'CG-' + (8800 + k), name: cn, skill: pick(skills), city: pick(D.cities),
      status: pick(cgStatus), rating: (rnd(40, 50) / 10).toFixed(1),
      onTime: rnd(84, 99), visitsToday: rnd(0, 8), visitsMonth: rnd(40, 180),
      battery: rnd(12, 100), burnout: rnd(8, 78), tenure: rnd(1, 36),
      lat: 28.4 + Math.random() * 0.5, lng: 77.0 + Math.random() * 0.5,
    });
  }

  /* ---- Emergencies (live) ---- */
  var emgTypes = ['Cardiac', 'Trauma', 'Obstetric', 'Paediatric', 'Respiratory', 'Stroke'];
  var emgPriority = ['P1', 'P1', 'P2', 'P3'];
  var emgStatus = ['En Route', 'On Scene', 'Dispatched', 'Returning'];
  D.emergencies = [];
  for (var e = 1; e <= 14; e++) {
    var pr = pick(emgPriority);
    D.emergencies.push({
      id: 'EMG-' + (74100 + e), type: pick(emgTypes), priority: pr,
      status: pick(emgStatus), zone: pick(D.cities),
      patient: D.name(), ambulance: 'AMB-' + rnd(100, 999),
      eta: rnd(2, 18) + ' min', triageSec: rnd(4, 10),
      lat: 28.4 + Math.random() * 0.55, lng: 76.95 + Math.random() * 0.6,
      sla: Math.random() > 0.12,
    });
  }

  /* ---- Hospitals / beds ---- */
  D.hospitals = D.cities.slice(0, 8).map(function (c, idx) {
    return {
      name: pick(['Apollo', 'Fortis', 'Max', 'Manipal', 'Medanta', 'AIIMS', 'Narayana', 'KIMS']) + ' · ' + c,
      city: c, general: rnd(20, 180), icu: rnd(2, 28), nicu: rnd(0, 14), ventilators: rnd(1, 20),
      occupancy: rnd(52, 96),
    };
  });

  /* ---- CRM / Leads ---- */
  var leadSrc = ['Website', 'WhatsApp', 'Phone', 'IVR', 'Referral', 'Google Ads', 'Facebook Ads', 'Corporate'];
  var leadStage = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'];
  D.leads = [];
  for (var l = 1; l <= 50; l++) {
    D.leads.push({
      id: 'LD-' + (3100 + l), name: D.name(), source: pick(leadSrc), stage: pick(leadStage),
      score: rnd(20, 98), value: rnd(2, 90) * 1000, owner: D.name(), city: pick(D.cities),
      created: rnd(0, 30) + 'd ago',
    });
  }

  /* ---- Sales pipeline (Kanban) ---- */
  D.pipeline = {
    'Lead In': [
      { id: 'OPP-401', org: 'TCS Wellness', value: 2400000, owner: 'Priya Nair', tag: 'Corporate' },
      { id: 'OPP-402', org: 'Sunrise Hospitals', value: 1850000, owner: 'Rohan Das', tag: 'Hospital' },
      { id: 'OPP-403', org: 'Star Health Insurance', value: 5600000, owner: 'Neha Gupta', tag: 'Insurance' },
    ],
    'Qualified': [
      { id: 'OPP-388', org: 'Infosys BPM', value: 3200000, owner: 'Karan Mehta', tag: 'Corporate' },
      { id: 'OPP-390', org: 'CareNest Pune', value: 980000, owner: 'Amit Singh', tag: 'Franchise' },
    ],
    'Proposal': [
      { id: 'OPP-371', org: 'Govt. of Rajasthan · PMJAY', value: 12500000, owner: 'Sneha Rao', tag: 'Government' },
      { id: 'OPP-375', org: 'Reliance Foundation', value: 4100000, owner: 'Priya Nair', tag: 'Corporate' },
    ],
    'Negotiation': [
      { id: 'OPP-352', org: 'Wipro Health', value: 6700000, owner: 'Rohan Das', tag: 'Corporate' },
    ],
    'Won': [
      { id: 'OPP-340', org: 'Apollo Care Hub', value: 8900000, owner: 'Neha Gupta', tag: 'Hospital' },
      { id: 'OPP-333', org: 'HDFC Ergo', value: 5400000, owner: 'Karan Mehta', tag: 'Insurance' },
    ],
  };

  /* ---- AI Models (v5.0 reference) ---- */
  D.aiModels = [
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

  /* ---- Compliance ---- */
  D.compliance = [
    { fw: 'DPDP Act 2023', region: 'India', status: 'Compliant', score: 98, controls: 'Consent-first, data localisation, DPO, 72-hr grievance' },
    { fw: 'ABDM / NDHM', region: 'India', status: 'Compliant', score: 96, controls: 'ABHA-linked, FHIR R4, HIU/HIP NHA' },
    { fw: 'NABH Telemedicine', region: 'India', status: 'Compliant', score: 94, controls: 'TPG 2020 protocols' },
    { fw: 'HIPAA', region: 'USA / Global', status: 'Compliant', score: 97, controls: 'PHI classification, BAA, breach <60h' },
    { fw: 'GDPR', region: 'EU', status: 'Compliant', score: 95, controls: 'Subject rights, consent, DPA' },
    { fw: 'ISO 27001', region: 'Global', status: 'Audit Due', score: 91, controls: 'ISMS, pentest, incident SLA' },
  ];

  /* ---- Activity feed (sec 5.2) ---- */
  var feedTemplates = [
    { type: 'Emergency Dispatched', icon: 'fa-truck-medical', color: '#fb7185', text: function () { return 'EMG-' + rnd(74100, 74200) + ' · ' + pick(emgTypes) + ' · ' + pick(D.cities) + ' · ETA ' + rnd(3, 14) + ' min'; } },
    { type: 'Appointment Booked', icon: 'fa-calendar-check', color: '#1b7df5', text: function () { return D.name() + ' → Dr. ' + D.name().split(' ')[0] + ' · ' + pick(specialties); } },
    { type: 'Referral Converted', icon: 'fa-share-nodes', color: '#16ad8f', text: function () { return 'REF-' + rnd(900, 999) + ' · ' + D.inr(rnd(800, 4000) * 10); } },
    { type: 'New Patient', icon: 'fa-user-plus', color: '#8b5cf6', text: function () { return D.name() + ' · via ' + pick(leadSrc); } },
    { type: 'Caregiver Check-In', icon: 'fa-location-dot', color: '#0ea5e9', text: function () { return D.name() + ' @ ' + D.name().split(' ')[1] + ' residence'; } },
    { type: 'RPM Alert', icon: 'fa-heart-pulse', color: '#ef4444', text: function () { return D.name() + ' · ' + pick(['SpO2 88%', 'BP 168/102', 'Glucose 312', 'HR 128']) + ' · High'; } },
    { type: 'Subscription', icon: 'fa-crown', color: '#f59e0b', text: function () { return pick(plans) + ' plan · ' + D.inr(rnd(99, 999) * 10); } },
  ];
  D.makeFeed = function (n) {
    var out = [];
    for (var i = 0; i < (n || 8); i++) {
      var t = pick(feedTemplates);
      out.push({ type: t.type, icon: t.icon, color: t.color, text: t.text(), time: rnd(1, 59) + 's ago' });
    }
    return out;
  };

  /* ---- Notifications ---- */
  D.notifications = [
    { icon: 'fa-truck-medical', color: '#fb7185', title: 'P1 Emergency · Cardiac', text: 'Delhi NCR · ambulance dispatched in 58s', time: '2m' },
    { icon: 'fa-triangle-exclamation', color: '#f59e0b', title: 'SLA breach risk', text: 'Mumbai zone caregiver coverage at 68%', time: '11m' },
    { icon: 'fa-heart-pulse', color: '#ef4444', title: 'RPM critical alert', text: 'PT-10293 SpO2 dropped to 86%', time: '18m' },
    { icon: 'fa-coins', color: '#16ad8f', title: 'Revenue milestone', text: 'MRR crossed ₹3.84 Cr this month', time: '1h' },
    { icon: 'fa-shield-halved', color: '#1b7df5', title: 'Security: all clear', text: 'SOC scan complete · 0 P1 incidents', time: '3h' },
  ];

})(window.MyDR24);
