import { PageTitle, Card, StatCard, Progress } from '../components/ui';
import { departments } from '../data';

export default function Departments() {
  const totalBeds = departments.reduce((s, d) => s + d.beds, 0);
  const occupied = departments.reduce((s, d) => s + d.occupied, 0);
  return (
    <>
      <PageTitle eyebrow="Facility" title="Departments" subtitle="Bed capacity, occupancy and staffing across hospital units."
        actions={<button className="btn btn-primary"><i className="fa-solid fa-plus" /> Add Department</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-sitemap" label="Departments" value={departments.length} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-bed" label="Total Beds" value={totalBeds} c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-bed-pulse" label="Occupied" value={occupied} c1="#f59e0b" c2="#d97706" />
        <StatCard icon="fa-percent" label="Occupancy" value={`${Math.round((occupied / totalBeds) * 100)}%`} c1="#8b5cf6" c2="#6d28d9" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {departments.map((d) => {
          const pct = Math.round((d.occupied / d.beds) * 100);
          const tone = pct > 85 ? '#ef4444' : pct > 65 ? '#f59e0b' : '#16ad8f';
          return (
            <Card key={d.name} className="p-5 hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg" style={{ background: d.color }}>
                  <i className={`fa-solid ${d.icon}`} />
                </div>
                <div>
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-muted text-xs">Head: {d.head}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="text-muted">Bed occupancy</span>
                <span className="metric">{d.occupied}/{d.beds} · {pct}%</span>
              </div>
              <Progress value={pct} tone={tone} />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line text-[13px]">
                <span className="text-muted"><i className="fa-solid fa-user-nurse mr-1.5" />{d.staff} staff</span>
                <span className="text-muted"><i className="fa-solid fa-bed mr-1.5" />{d.beds - d.occupied} free</span>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
