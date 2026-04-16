import { LayoutDashboard, ListTodo, CalendarDays, TimerReset, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/pomodoro", label: "Pomodoro", icon: TimerReset },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

const Sidebar = () => (
  <aside className="w-full max-w-xs rounded-lg border border-white/10 bg-slate-950/45 p-4 shadow-panel backdrop-blur md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.18em] text-mint/80">TaskFlow</div>
      <h1 className="mt-2 text-2xl font-semibold text-white">Build momentum daily.</h1>
    </div>
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-teal text-slate-950"
                  : "text-slate-200 hover:bg-white/8 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;
