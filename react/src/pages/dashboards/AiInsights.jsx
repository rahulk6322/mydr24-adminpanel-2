import { PageHeader, StatCard, Card, SectionTitle } from '../../components/ui/Primitives';
import { useToast } from '../../context/ToastContext';

function Insight({ icon, color, title, text }) {
  return (
    <div className="flex gap-3 p-3.5 rounded-xl card-2 border border-line">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-none" style={{ background: color + '1f', color }}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div><div className="font-semibold text-[13.5px]">{title}</div><div className="text-muted text-[12.5px] mt-0.5">{text}</div></div>
    </div>
  );
}

export default function AiInsights() {
  const toast = useToast();
  return (
    <>
      <PageHeader eyebrow="Intelligence · Generative" title="AI Executive Insights"
        subtitle="Prescriptive recommendations synthesised from 9 production models across the platform."
        actions={[{ label: 'Regenerate', icon: 'fa-arrows-rotate', variant: 'primary', onClick: () => toast({ title: 'Insights regenerated', text: 'Re-synthesised from latest model outputs.', type: 'info' }) }]} />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-brain" value="9" label="Models Synthesised" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-lightbulb" value="24" label="Active Recommendations" c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-indian-rupee-sign" value="₹2.1 Cr" label="Projected Upside" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-triangle-exclamation" value="3" label="Risks Flagged" c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-2">
        <Card className="p-5">
          <SectionTitle title="Growth Opportunities" sub="Prescriptive" />
          <div className="space-y-2.5">
            <Insight icon="fa-arrow-trend-up" color="#16ad8f" title="Scale Tier-1 acquisition pods" text="Delhi NCR & Bengaluru show 41% of net-new MRR. Adding 2 pods projects +₹18L MRR/quarter at stable CAC." />
            <Insight icon="fa-share-nodes" color="#1b7df5" title="Activate referral viral loop" text="Referral ROAS 11.2x with 0.4 viral coefficient. Incentive bump to ₹500 could lift to 0.6." />
            <Insight icon="fa-crown" color="#8b5cf6" title="Upsell chronic cohort to Platinum" text="2,400 Gold RPM patients fit the Platinum profile. A targeted journey projects +₹9L MRR." />
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Risk & Mitigation" sub="Predictive" />
          <div className="space-y-2.5">
            <Insight icon="fa-user-nurse" color="#f59e0b" title="Mumbai caregiver shortfall" text="Coverage 68% vs 70%. Activate 14 standby + surge incentive within 48h to protect SLA." />
            <Insight icon="fa-heart-pulse" color="#ef4444" title="RPM deterioration cluster" text="23 high-risk patients flagged (87% precision). Auto-escalation to on-call physicians queued." />
            <Insight icon="fa-virus-covid" color="#0ea5e9" title="Outbreak signal · Jaipur" text="Respiratory cluster detected 72h ahead of official alert. Pre-position resources recommended." />
          </div>
        </Card>
      </div>
    </>
  );
}
