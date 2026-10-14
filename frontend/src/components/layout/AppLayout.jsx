import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

// Owner: Rahul. Sidebar + page area. Every logged-in page renders inside <Outlet />.
export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white text-ink">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
