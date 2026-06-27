import { PageHeader, StatCard, Card, SectionTitle, KV, Progress } from '../components/ui/Primitives';
import { Bars, Donut } from '../components/charts/Charts';
import { exec, revenueSeries, serviceMix, months } from '../lib/data';
import { inr } from '../lib/format';

export default function Finance() {
  return (
    <>
      <PageHeader eyebrow="Business · Finance" title="Finance Dashboard"
        subtitle="Revenue, billing, GST/TDS, refunds, cash flow and AI forecast." />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-sack-dollar" value={inr(exec.mrr)} label="MRR" sub={`ARR ${inr(exec.arr)}`} trend={20} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-chart-pie" value={`${exec.grossMargin}%`} label="Gross Margin" trend={3} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-money-bill-transfer" value="₹38.7 Cr" label="Cash in Bank" sub={`${exec.runwayMonths}mo runway`} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-receipt" value="0.7%" label="Revenue Leakage" sub="of GMV" trend={-2} positiveGood={false} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid-3 mb-4">
        <Card className="p-5 col-span-2">
          <SectionTitle title="Cash Flow" sub="Inflow vs Outflow · ₹M" />
          <Bars categories={months} series={[
            { name: 'Inflow', data: revenueSeries, color: '#16ad8f' },
            { name: 'Outflow', data: revenueSeries.map((v) => +(v * 0.78).toFixed(1)), color: '#fb7185' },
          ]} />
        </Card>
        <Card className="p-5">
          <SectionTitle title="Statutory" sub="Current period" />
          <KV k="GST Collected" v="₹4.2 Cr" /><KV k="TDS Deducted" v="₹86 L" />
          <KV k="Refunds Issued" v="₹12 L" /><KV k="Commission Payable" v="₹4.2 Cr" /><KV k="Net Payable" v="₹3.1 Cr" />
        </Card>
      </div>
      <div className="grid-2">
        <Card className="p-5"><SectionTitle title="Revenue by Service" /><Donut data={serviceMix} legend="right" /></Card>
        <Card className="p-5"><SectionTitle title="Expense Breakdown" />
          {[['Workforce & Commission', 42], ['Technology & Cloud', 18], ['Marketing & CAC', 22], ['Operations', 12], ['G&A', 6]].map(([l, p]) => (
            <div className="mb-3" key={l}><div className="flex justify-between text-[13px] mb-1.5"><span>{l}</span><span className="metric-value">{p}%</span></div><Progress value={p} /></div>
          ))}
        </Card>
      </div>
    </>
  );
}
