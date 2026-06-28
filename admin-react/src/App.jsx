import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import Pharmacy from './pages/Pharmacy';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="departments" element={<Departments />} />
            <Route path="pharmacy" element={<Pharmacy />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
