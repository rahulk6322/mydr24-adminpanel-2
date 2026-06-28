import { PageTitle, StatCard, Card, Avatar, StatusBadge } from '../components/ui';
import { doctors } from '../data';

export default function Doctors() {
  return (
    <>
      <PageTitle eyebrow="Staff" title="Doctors" subtitle="Specialists, availability, schedules and consultation fees."
        actions={<button className="btn btn-primary"><i className="fa-solid fa-user-plus" /> Add Doctor</button>} />
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard icon="fa-user-doctor" label="Total Doctors" value="342" trend={5} c1="#1b7df5" c2="#1465e1" />
        <StatCard icon="fa-circle-check" label="Available Now" value="186" c1="#16ad8f" c2="#0a8b75" />
        <StatCard icon="fa-scissors" label="In Surgery" value="24" c1="#8b5cf6" c2="#6d28d9" />
        <StatCard icon="fa-star" label="Avg Rating" value="4.6/5" trend={2} c1="#f59e0b" c2="#d97706" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((d) => (
          <Card key={d.id} className="p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3.5">
              <Avatar name={d.name} size={52} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{d.name}</div>
                <div className="text-muted text-[13px]">{d.specialty}</div>
              </div>
              <StatusBadge value={d.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="rounded-xl bg-surface-2 border border-line py-2.5">
                <div className="metric text-base">{d.patientsToday}</div><div className="text-muted text-[10.5px] mt-0.5">Today</div>
              </div>
              <div className="rounded-xl bg-surface-2 border border-line py-2.5">
                <div className="metric text-base">{d.rating}<i className="fa-solid fa-star text-amber-400 text-[10px] ml-0.5" /></div><div className="text-muted text-[10.5px] mt-0.5">Rating</div>
              </div>
              <div className="rounded-xl bg-surface-2 border border-line py-2.5">
                <div className="metric text-base">₹{d.fee}</div><div className="text-muted text-[10.5px] mt-0.5">Fee</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-[13px]">
              <span className="text-muted"><i className="fa-solid fa-briefcase-medical mr-1.5" />{d.experience}</span>
              <button className="btn btn-ghost !py-1.5 !px-3 !text-[12.5px]">View Profile</button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
