import { useState, useEffect } from 'react';
import { PageHeader, Card, SectionTitle, Progress, Feed, Status } from '../../components/ui/Primitives';
import { AreaTrend } from '../../components/charts/Charts';
import { liveOps, exec, zonesGeo, makeFeed } from '../../lib/data';
import { num, rnd } from '../../lib/format';

function LiveCard({ icon, color, value, label, sub }) {
  return (
    <Card hover className="p-5">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: color }}>
          <i className={`fa-solid ${icon}`} />
        </div>
        <span className="live-dot" />
      </div>
      <div className="metric-value text-[27px] mt-4 leading-none">{value}</div>
      <div className="text-muted text-[13px] mt-1.5">{label}</div>
      <div className="text-[11.5px] mt-1 font-mono" style={{ color }}>{sub}</div>
    </Card>
  );
}

function ResourceBars() {
  const lo = liveOps;
  const data = [
    ['Doctors Online', lo.doctorsOnline, lo.doctorsOnline + lo.doctorsOnCall, '#1b7df5'],
    ['Caregivers Available', lo.caregiversAvailable, lo.caregiversAvailable + lo.caregiversEnRoute, '#16ad8f'],
    ['Ambulances Ready', lo.ambulancesReady, lo.ambulancesReady + lo.ambulancesDeployed, '#fb7185'],
    ['Hospital Beds', lo.bedsAvailable, lo.bedsAvailable + 400, '#8b5cf6'],
  ];
  return data.map(([label, a, b, c], i) => (
    <div className="mb-3.5" key={i}>
      <div className="flex justify-between text-[13px] mb-1.5"><span>{label}</span><span className="metric-value">{a}<span className="text-muted text-xs">/{b}</span></span></div>
      <Progress value={Math.round((a / b) * 100)} color={c} />
    </div>
  ));
}

export default function LiveOps() {
  const lo = liveOps;
  const [feed, setFeed] = useState(() => makeFeed(9));
  const [pts, setPts] = useState(() => Array.from({ length: 30 }, () => rnd(180, 420)));

  useEffect(() => {
    const t = setInterval(() => {
      setFeed(makeFeed(9));
      setPts((p) => [...p.slice(1), rnd(180, 420)]);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <PageHeader eyebrow="Operations · Real-Time" title="Live Operations Center"
        subtitle="Sub-second platform telemetry across consultations, home visits, emergencies and revenue throughput." />

      <div className="grid-4 stagger mb-4">
        <LiveCard icon="fa-video" color="#1b7df5" value={lo.activeConsults} label="Active Consultations" sub={`${lo.consultsBreak.video}V · ${lo.consultsBreak.audio}A · ${lo.consultsBreak.chat}C`} />
        <LiveCard icon="fa-house-medical" color="#16ad8f" value={lo.activeHomeVisits} label="Active Home Visits" sub={`${lo.homeBreak.nursing}N · ${lo.homeBreak.icu}ICU · ${lo.homeBreak.care}Care`} />
        <LiveCard icon="fa-truck-medical" color="#fb7185" value={lo.activeEmergencies} label="Active Emergencies" sub={`${lo.emgBreak.crit}Crit · ${lo.emgBreak.high}High · ${lo.emgBreak.med}Med`} />
        <LiveCard icon="fa-indian-rupee-sign" color="#f59e0b" value={`₹${num(exec.revPerMin)}`} label="Revenue / Minute" sub="Live throughput" />
      </div>

      <div className="grid-3 mb-4">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Throughput · Last 30 Minutes" sub="Requests / minute" right={<span className="live-dot" />} />
          <AreaTrend categories={pts.map((_, i) => `${i}`)} series={[{ name: 'req/min', data: pts, color: '#1b7df5', fill: true }]} legend={false} height={240} />
        </Card>
        <Card className="p-5"><SectionTitle title="Available Resources" sub="Live panel" /><ResourceBars /></Card>
      </div>

      <div className="grid-2">
        <Card className="p-5"><SectionTitle title="Live Activity Feed" right={<span className="live-dot" />} /><Feed items={feed} /></Card>
        <Card className="p-5">
          <SectionTitle title="Regional Demand" sub="Active zones" />
          {zonesGeo.map((z) => (
            <div key={z.name} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgb(var(--c-border)/.5)' }}>
              <span className="text-[13.5px] font-medium">{z.name}</span>
              <div className="flex items-center gap-3"><Status value={z.demand} /><span className="metric-value text-[13px] w-10 text-right">{z.util}%</span></div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
