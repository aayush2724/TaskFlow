import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => (
  <div className="min-h-screen p-4 md:p-6">
    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="space-y-6">
        <Navbar />
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
