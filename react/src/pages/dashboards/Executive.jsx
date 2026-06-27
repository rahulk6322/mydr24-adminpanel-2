import { useState, useEffect } from 'react';
import { PageHeader, StatCard, Card, SectionTitle, Ring, KV, Feed } from '../../components/ui/Primitives';
import { AreaTrend, Donut } from '../../components/charts/Charts';
import { useToast } from '../../context/ToastContext';
import { exec, revenueSeries, forecastSeries, serviceMix, months, makeFeed } from '../../lib/data';
import { inr, num } from '../../lib/format';

function AiInsight({ icon, color, title, text }) {
  return (
    <div className="flex gap-3 p-3.5 rounded-xl card-2 border border-line">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-none" style={{ background: color + '1f', color }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div>
        <div className="font-semibold text-[13.5px]">{title}</div>
        <div className="text-muted text-[12.5px] mt-0.5">{text}</div>
      </div>
    </div>
  );
}

export default function Executive() {
  const toast = useToast();
  const [feed, setFeed] = useState(() => makeFeed(7));

  useEffect(() => {
    const t = setInterval(() => setFeed(makeFeed(7)), 4000);
    return () => clearInterval(t);
  }, []);

  const trendCats = [...months, 'Jul+', 'Aug+', 'Sep+', 'Oct+', 'Nov+', 'Dec+'];
  const actual = [...revenueSeries, ...Array(6).fill(null)];
  const forecast = [...Array(11).fill(null), revenueSeries[11], ...forecastSeries.slice(1)];

  return (
    <>
      <PageHeader
        eyebrow={`Executive Command Center · ${new Date().toDateString()}`}
        title="Enterprise Health at a Glance"
        subtitle="Unified real-time view of clinical operations, growth, finance and platform reliability across the MyDR24 network."
        actions={[
          { label: 'Export Brief', icon: 'fa-file-export', variant: 'ghost', onClick: () => toast({ title: 'Brief exported', text: 'Executive PDF queued for delivery.', type: 'success' }) },
          { label: 'AI Summary', icon: 'fa-brain', variant: 'primary', onClick: () => toast({ title: 'AI summary generated', text: 'Synthesised from 9 production models.', type: 'info' }) },
        ]}
      />

      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-indian-rupee-sign" value={inr(exec.mrr)} label="Monthly Recurring Revenue" sub={`ARR ${inr(exec.arr)}`} trend={20.4} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-users" value={num(exec.activePatients)} label="Active Patients" sub={`MAU ${num(exec.mau)}`} trend={12.1} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-stethoscope" value={num(exec.consultsMTD)} label="Consults (MTD)" sub={`${exec.homeVisitsMTD / 1000}K home visits`} trend={8.6} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-gauge-high" value={`${exec.slaCompliance}%`} label="SLA Compliance" sub={`Uptime ${exec.uptime}%`} trend={1.4} c1="#f59e0b" c2="#d97706" />
      </div>

      <div className="grid-3 mb-4">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Revenue Trajectory & AI Forecast" sub="MRR ₹M · 12 months actual + 6-month forecast (94% model accuracy)" />
          <AreaTrend categories={trendCats} series={[
            { name: 'Actual MRR', data: actual, color: '#1b7df5', fill: true },
            { name: 'Forecast', data: forecast, color: '#8b5cf6', fill: false },
          ]} />
        </Card>
        <Card className="p-5">
          <SectionTitle title="Revenue by Service Line" sub="Share of GMV" />
          <Donut data={serviceMix} legend="bottom" height={220} />
          <div className="divider my-3" />
          <div className="flex items-center justify-between text-sm"><span className="text-muted">Gross Margin</span><span className="metric-value">{exec.grossMargin}%</span></div>
        </Card>
      </div>

      <div className="grid-4 mb-4">
        <Card className="p-5 flex items-center justify-center"><Ring pct={exec.businessHealth} label="Business Health" value="Excellent" color="#16ad8f" /></Card>
        <Card className="p-5 flex items-center justify-center"><Ring pct={exec.orgHealth} label="Org Health" value="Strong" color="#1b7df5" /></Card>
        <Card className="p-5">
          <div className="eyebrow mb-3">Capital Efficiency</div>
          <KV k="Burn Rate" v={`${inr(exec.burnRate)}/mo`} />
          <KV k="Runway" v={`${exec.runwayMonths} months`} />
          <KV k="EBITDA Margin" v={`${exec.ebitdaMargin}%`} />
          <KV k="NRR" v={`${exec.nrr}%`} />
        </Card>
        <Card className="p-5">
          <div className="eyebrow mb-3">Unit Economics</div>
          <KV k="LTV : CAC" v={`${exec.ltvCac}x`} />
          <KV k="ARPU" v={`₹${exec.arpu}`} />
          <KV k="DAU / MAU" v={`${Math.round((exec.dau / exec.mau) * 100)}%`} />
          <KV k="API P99" v={`${exec.apiP99} ms`} />
        </Card>
      </div>

      <div className="grid-3">
        <Card className="p-5">
          <SectionTitle title="Live Activity Feed" sub="Real-time platform events" right={<span className="live-dot" />} />
          <Feed items={feed} />
        </Card>
        <Card className="p-5 col-span-2">
          <SectionTitle title="AI Executive Insights" sub="Generated by MyDR24 Intelligence Engine" />
          <div className="space-y-2.5">
            <AiInsight icon="fa-arrow-trend-up" color="#16ad8f" title="Revenue acceleration in Tier-1 metros" text="Delhi NCR & Bengaluru contributed 41% of net-new MRR. Reallocating 2 acquisition pods projects +₹18L MRR next quarter." />
            <AiInsight icon="fa-triangle-exclamation" color="#f59e0b" title="Caregiver supply gap forming in Mumbai" text="Coverage at 68% vs 70% threshold. Activate 14 standby caregivers and trigger surge incentive within 48h." />
            <AiInsight icon="fa-heart-pulse" color="#ef4444" title="RPM cohort deterioration risk" text="23 high-risk patients flagged by the deterioration model (87% precision). Auto-escalation queued to on-call physicians." />
            <AiInsight icon="fa-shield-halved" color="#1b7df5" title="Compliance posture strong" text="All 6 frameworks green except ISO 27001 (audit due in 12 days). No P1 security incidents this cycle." />
          </div>
        </Card>
      </div>
    </>
  );
}
