import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Shell from './components/layout/Shell';

import Executive from './pages/dashboards/Executive';
import Leadership from './pages/dashboards/Leadership';
import LiveOps from './pages/dashboards/LiveOps';
import AiInsights from './pages/dashboards/AiInsights';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Doctors from './pages/Doctors';
import Caregivers from './pages/Caregivers';
import Emergency from './pages/Emergency';
import { CRM, Leads } from './pages/CRM';
import Pipeline from './pages/Pipeline';
import Finance from './pages/Finance';
import { Analytics, AiModels, Compliance } from './pages/Intelligence';
import GenericModule from './pages/GenericModule';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Navigate to="/exec" replace />} />

              {/* Command Center */}
              <Route path="exec" element={<Wrap><Executive /></Wrap>} />
              <Route path="dash-ceo" element={<Wrap><Leadership id="dash-ceo" /></Wrap>} />
              <Route path="dash-coo" element={<Wrap><Leadership id="dash-coo" /></Wrap>} />
              <Route path="dash-cfo" element={<Wrap><Leadership id="dash-cfo" /></Wrap>} />
              <Route path="dash-cmo" element={<Wrap><Leadership id="dash-cmo" /></Wrap>} />
              <Route path="dash-cto" element={<Wrap><Leadership id="dash-cto" /></Wrap>} />
              <Route path="dash-growth" element={<Wrap><Leadership id="dash-growth" /></Wrap>} />
              <Route path="live-ops" element={<Wrap><LiveOps /></Wrap>} />
              <Route path="ai-insights" element={<Wrap><AiInsights /></Wrap>} />

              {/* Clinical */}
              <Route path="patients" element={<Wrap><Patients /></Wrap>} />
              <Route path="patients/:id" element={<Wrap><PatientProfile /></Wrap>} />
              <Route path="doctors" element={<Wrap><Doctors /></Wrap>} />
              <Route path="caregivers" element={<Wrap><Caregivers /></Wrap>} />
              <Route path="caregiver-live" element={<Wrap><Caregivers live /></Wrap>} />

              {/* Emergency */}
              <Route path="emergency-center" element={<Wrap><Emergency view="center" /></Wrap>} />
              <Route path="ambulance-map" element={<Wrap><Emergency view="map" /></Wrap>} />
              <Route path="ai-triage" element={<Wrap><Emergency view="triage" /></Wrap>} />
              <Route path="hospital-beds" element={<Wrap><Emergency view="beds" /></Wrap>} />
              <Route path="demand-heatmap" element={<Wrap><Emergency view="heatmap" /></Wrap>} />

              {/* Growth */}
              <Route path="crm" element={<Wrap><CRM /></Wrap>} />
              <Route path="leads" element={<Wrap><Leads /></Wrap>} />
              <Route path="pipeline" element={<Wrap><Pipeline /></Wrap>} />

              {/* Finance & Intelligence */}
              <Route path="finance" element={<Wrap><Finance /></Wrap>} />
              <Route path="analytics" element={<Wrap><Analytics /></Wrap>} />
              <Route path="ai-models" element={<Wrap><AiModels /></Wrap>} />
              <Route path="compliance" element={<Wrap><Compliance /></Wrap>} />

              {/* Everything else resolves to the data-driven generic module */}
              <Route path=":moduleId" element={<Wrap><GenericModule /></Wrap>} />
              <Route path="*" element={<Wrap><GenericModule /></Wrap>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

// Lightweight per-route error boundary wrapper.
function Wrap({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
