import { PageTitle, StatCard, DataTable, Badge, StatusBadge, Progress } from '../components/ui';
import { pharmacy, inr } from '../data';

export default function Pharmacy() {
  const low = pharmacy.filter((m) => m.status === 'Low').length;
  const out = pharmacy.filter((m) => m.status === 'Out of Stock').length;

  const columns = [
    { key: 'drug', label: 'Medicine', render: (r) => (
      <div><div className="font-semibold">{r.drug}</div><div className="text-muted text-xs font-mono">{r.id}</div></div>
    ) },
    { key: 'category', label: 'Category', render: (r) => <Badge tone="blue">{r.category}</Badge> },
    { key: 'stock', label: 'Stock', render: (r) => (
      <div className="w-32">
        <div className="flex justify-between text-[12px] mb-1"><span className="metric">{r.stock}</span><span className="text-muted">/ {r.reorder}+ </span></div>
        <Progress value={Math.min((r.stock / 400) * 100, 100)} tone={r.stock === 0 ? '#ef4444' : r.stock < 150 ? '#f59e0b' : '#16ad8f'} />
      </div>
    ) },
    { key: 'price', label: 'Price', align: 'right', render: (r) => <span className="metric text-[13px]">{inr(r.price)}</span> },
    { key: 'status', label: 'Status', align: 'right', render: (r) => <StatusBadge value={r.status} /> },
  ];

  return (
    <>
      <PageTitle eyebrow="Inventory" title="Pharmacy" subtitle="Medicine stock levels, reorder alerts and pricing."
        actions={<button className="btn btn-primary"><i className="fa-solid fa-plus" /> Add Medicine</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-prescription-bottle-medical" label="Total Items" value={pharmacy.length} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-triangle-exclamation" label="Low Stock" value={low} c1="#f59e0b" c2="#d97706" />
        <StatCard icon="fa-ban" label="Out of Stock" value={out} c1="#ef4444" c2="#b91c1c" />
        <StatCard icon="fa-indian-rupee-sign" label="Stock Value" value="₹48.2 L" trend={6} c1="#16ad8f" c2="#0a8b75" />
      </div>
      <DataTable columns={columns} rows={pharmacy} title="Medicine Inventory" sub={`${pharmacy.length} items`} />
    </>
  );
}
