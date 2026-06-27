import { PageHeader, StatCard, Card, SectionTitle } from '../components/ui/Primitives';
import Kanban from '../components/ui/Kanban';
import { pipelineSeed } from '../lib/data';
import { inr } from '../lib/format';

export default function Pipeline() {
  const total = Object.values(pipelineSeed).flat().reduce((s, c) => s + c.value, 0);
  return (
    <>
      <PageHeader eyebrow="Growth · Sales" title="Sales Pipeline"
        subtitle={`Drag opportunities across stages · ${inr(total)} weighted pipeline · AI revenue prediction.`} />
      <div className="grid-4 stagger mb-4">
        <StatCard icon="fa-diagram-project" value={inr(total)} label="Total Pipeline" trend={14} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-trophy" value="₹1.43 Cr" label="Won (MTD)" trend={22} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-percent" value="32%" label="Win Rate" trend={4} c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-hourglass" value="24 days" label="Avg Cycle" trend={-8} positiveGood={false} c1="#f59e0b" c2="#d97706" />
      </div>
      <Card className="p-5">
        <SectionTitle title="Opportunity Board" sub="Drag cards between stages" />
        <Kanban initial={pipelineSeed} />
      </Card>
    </>
  );
}
