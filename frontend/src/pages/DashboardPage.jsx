import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAnalytics, fetchTasks, selectAnalytics, selectTasks } from "../features/tasks/tasksSlice";
import StatCard from "../components/StatCard";

const colors = ["#ff7a59", "#f5c451", "#72f0c3", "#0b8f8c", "#7dd3fc"];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const analytics = useSelector(selectAnalytics);
  const tasks = useSelector(selectTasks);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (!analytics) {
    return <div className="text-slate-200">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Productivity Dashboard</h1>
        <p className="mt-2 text-slate-400">Welcome back. Here is your current momentum and focus metrics.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tasks"
          value={analytics.overview.total}
          helper={`${tasks.filter((task) => task.status !== "completed").length} still in motion`}
          accent="text-mint"
        />
        <StatCard
          label="Completion Rate"
          value={`${analytics.overview.completionRate}%`}
          helper={`${analytics.overview.completed} completed`}
          accent="text-teal"
        />
        <StatCard
          label="Current Streak"
          value={`${analytics.streaks.currentStreak} days`}
          helper={`Longest: ${analytics.streaks.longestStreak} days`}
          accent="text-sun"
        />
        <StatCard
          label="Level"
          value={analytics.streaks.level}
          helper={`${analytics.streaks.xp} XP earned`}
          accent="text-coral"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-white/10 bg-slate-950/35 p-5 shadow-panel">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Completion Momentum</h3>
            <p className="text-sm text-slate-300">Daily task flow across your recent sessions.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.completionTrend}>
                <defs>
                  <linearGradient id="completedFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#72f0c3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#72f0c3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#72f0c3"
                  fillOpacity={1}
                  fill="url(#completedFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-slate-950/35 p-5 shadow-panel">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Priority Mix</h3>
            <p className="text-sm text-slate-300">Where your attention is currently stacked.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.priorityMix} dataKey="value" nameKey="name" outerRadius={90}>
                  {analytics.priorityMix.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-lg border border-white/10 bg-slate-950/35 p-5 shadow-panel">
          <h3 className="text-lg font-semibold text-white">Heatmap</h3>
          <p className="mb-4 text-sm text-slate-300">A quick read on how often you are finishing tasks.</p>
          <div className="grid grid-cols-7 gap-2">
            {analytics.heatmap.slice(-28).map((entry) => (
              <div
                key={entry.date}
                title={`${entry.date}: ${entry.count} completed`}
                className="aspect-square rounded-md border border-white/10"
                style={{
                  backgroundColor:
                    entry.count >= 4
                      ? "#72f0c3"
                      : entry.count >= 2
                        ? "#0b8f8c"
                        : entry.count >= 1
                          ? "#f5c451"
                          : "rgba(255,255,255,0.06)",
                }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/35 p-5 shadow-panel">
          <h3 className="text-lg font-semibold text-white">Unlocked Badges</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {analytics.badges.length ? (
              analytics.badges.map((badge) => (
                <div key={badge} className="rounded-md bg-white/8 px-3 py-2 text-sm text-white">
                  {badge}
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-300">Complete your first task to begin the collection.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
