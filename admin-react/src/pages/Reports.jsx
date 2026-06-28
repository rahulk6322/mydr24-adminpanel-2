import { PageTitle, Card, StatCard, SectionHeader, Progress } from '../components/ui';
import { RevenueArea, VisitsBar, DeptDonut } from '../components/Charts';
import { revenueSeries, weeklyVisits, appointmentsByDept, inr } from '../data';

export default function Reports() {
  const kpiBars = [
    ['Patient Satisfaction', 92], ['Bed Utilisation', 78], ['On-Time Appointments', 88],
    ['Staff Productivity', 84], ['Revenue Target', 96],
  ];
  return (
    <>
      <PageTitle eyebrow="Analytics" title="Reports & Insights" subtitle="Financial, operational and clinical performance overview."
        actions={<button className="btn btn-ghost"><i className="fa-solid fa-file-export" /> Export PDF</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-indian-rupee-sign" label="YTD Revenue" value={inr(1284000000)} trend={14} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-chart-line" label="Net Margin" value="23.4%" trend={3} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-user-check" label="Patient CSAT" value="4.6/5" trend={2} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-stethoscope" label="Avg Length of Stay" value="3.8 days" trend={-4} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3 mb-5">
        <Card className="p-5 xl:col-span-2">
          <SectionHeader title="Revenue vs Expense" sub="Trailing 12 months" />
          <RevenueArea data={revenueSeries} />
        </Card>
        <Card className="p-5">
          <SectionHeader title="Performance KPIs" sub="vs targets" />
          <div className="space-y-4 mt-2">
            {kpiBars.map(([label, v]) => (
              <div key={label}>
                <div className="flex justify-between text-[13px] mb-1.5"><span>{label}</span><span className="metric">{v}%</span></div>
                <Progress value={v} tone={v >= 90 ? '#16ad8f' : v >= 75 ? '#1b7df5' : '#f59e0b'} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <SectionHeader title="Weekly Visits" sub="Online vs walk-in" />
          <VisitsBar data={weeklyVisits} />
        </Card>
        <Card className="p-5">
          <SectionHeader title="Dept Distribution" />
          <DeptDonut data={appointmentsByDept} />
        </Card>
      </div>
    </>
  );
}
