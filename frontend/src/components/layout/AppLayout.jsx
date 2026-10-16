import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

// Owner: Rahul. Sidebar on the left, the page on the right. Every logged-in page renders inside <Outlet />.
export default function AppLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
