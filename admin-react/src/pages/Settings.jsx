import { useState } from 'react';
import { PageTitle, Card, SectionHeader, Avatar } from '../components/ui';
import { useTheme } from '../theme';

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} aria-pressed={on}
      className="inline-flex w-11 h-6 rounded-full p-0.5 transition-colors"
      style={{ background: on ? '#16ad8f' : 'rgb(var(--border))' }}>
      <span className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? 'translateX(20px)' : 'none' }} />
    </button>
  );
}

export default function Settings() {
  const { theme, toggle } = useTheme();
  const [prefs, setPrefs] = useState({ email: true, sms: true, push: false, twoFa: true });
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <>
      <PageTitle eyebrow="Configuration" title="Settings" subtitle="Manage your profile, hospital details and preferences." />
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <Card className="p-5">
          <SectionHeader title="Profile" />
          <div className="flex items-center gap-4 mb-5">
            <Avatar name="Aryan Kapoor" size={64} />
            <div>
              <div className="font-semibold text-lg">Aryan Kapoor</div>
              <div className="text-muted text-sm">Super Admin · MyDR24</div>
            </div>
          </div>
          <div className="space-y-3">
            <div><label className="text-[12.5px] font-semibold text-muted mb-1.5 block">Full Name</label><input className="input" defaultValue="Aryan Kapoor" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[12.5px] font-semibold text-muted mb-1.5 block">Email</label><input className="input" defaultValue="admin@mydr24.com" /></div>
              <div><label className="text-[12.5px] font-semibold text-muted mb-1.5 block">Phone</label><input className="input" defaultValue="+91 96673 78887" /></div>
            </div>
            <div><label className="text-[12.5px] font-semibold text-muted mb-1.5 block">Hospital</label><input className="input" defaultValue="MyDR24 Multi-Speciality" /></div>
          </div>
          <button className="btn btn-primary mt-5"><i className="fa-solid fa-floppy-disk" /> Save Changes</button>
        </Card>

        <Card className="p-5">
          <SectionHeader title="Preferences" />
          <Row label="Dark mode" desc="Use the dark theme across the panel"><Toggle on={theme === 'dark'} onChange={toggle} /></Row>
          <Row label="Email notifications" desc="Appointment & billing alerts"><Toggle on={prefs.email} onChange={set('email')} /></Row>
          <Row label="SMS alerts" desc="Critical patient updates"><Toggle on={prefs.sms} onChange={set('sms')} /></Row>
          <Row label="Push notifications" desc="Browser push alerts"><Toggle on={prefs.push} onChange={set('push')} /></Row>
          <Row label="Two-factor auth" desc="Extra login security"><Toggle on={prefs.twoFa} onChange={set('twoFa')} /></Row>

          <div className="mt-5 pt-5 border-t border-line">
            <SectionHeader title="Integrations" />
            {[['fa-whatsapp', 'WhatsApp Business', '#16ad8f'], ['fa-credit-card', 'Razorpay Payments', '#1b7df5'], ['fa-hospital', 'ABDM / ABHA', '#8b5cf6']].map(([icon, label, c]) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5"><i className={`fa-brands fa-solid ${icon}`} style={{ color: c }} /><span className="text-[13.5px]">{label}</span></div>
                <span className="badge badge-green"><i className="fa-solid fa-check" /> Connected</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-line/60 last:border-0">
      <div><div className="text-[13.5px] font-medium">{label}</div><div className="text-muted text-[11.5px]">{desc}</div></div>
      {children}
    </div>
  );
}
