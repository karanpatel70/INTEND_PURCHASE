import { Navigate, Outlet, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/indenter/Dashboard.jsx';
import MyIndents from './pages/indenter/MyIndents.jsx';
import IndentDetail from './pages/indents/IndentDetail.jsx';
import TrackIndent from './pages/indents/TrackIndent.jsx';
import CreateIndent from './pages/indenter/CreateIndent.jsx';
import FormPreview from './pages/indents/FormPreview.jsx';
import FillSection from './pages/approver/FillSection.jsx';
import Inbox from './pages/approver/Inbox.jsx';
import OrdersList from './pages/orders/OrdersList.jsx';
import AdminIndents from './pages/admin/AdminIndents.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import ControlPanel from './pages/admin/ControlPanel.jsx';

// Only a signed-in user gets past this. Everyone else is sent to the login page.
function RequireLogin() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<RequireLogin />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-indents" element={<MyIndents />} />
          <Route path="/indents/:id" element={<IndentDetail />} />
          <Route path="/track" element={<TrackIndent />} />
          <Route path="/indents/new" element={<CreateIndent />} />
          <Route path="/indents/:id/preview" element={<FormPreview />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/indents/:id/fill/:section" element={<FillSection />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/admin/indents" element={<AdminIndents />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/control-panel" element={<ControlPanel />} />
        </Route>
      </Route>
    </Routes>
  );
}
