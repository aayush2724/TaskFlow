import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCheck, Rocket, TimerReset } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, register, selectAuthLoading } from "../features/auth/authSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "register") {
      dispatch(register(form));
      return;
    }
    dispatch(login({ email: form.email, password: form.password }));
  };

  return (
    <div className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/35 p-8 shadow-panel backdrop-blur">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
            alt="Focused workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="text-sm uppercase tracking-[0.18em] text-mint">TaskFlow</div>
            <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
              Finish what matters and watch the streak build.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">
              Track tasks, see your momentum, and turn consistency into something visible.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { icon: CheckCheck, title: "Task planning" },
                { icon: Rocket, title: "Momentum metrics" },
                { icon: TimerReset, title: "Focus sessions" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-md border border-white/10 bg-slate-950/45 p-4">
                    <Icon className="text-mint" size={20} />
                    <div className="mt-3 text-sm font-medium text-white">{item.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="rounded-lg border border-white/10 bg-slate-950/45 p-6 shadow-panel backdrop-blur"
        >
          <div className="mb-6 flex gap-2">
            {["login", "register"].map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setMode(entry)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                  mode === entry ? "bg-teal text-slate-950" : "bg-white/6 text-slate-100"
                }`}
              >
                {entry === "login" ? "Login" : "Create account"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {mode === "register" ? (
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Name"
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none placeholder:text-slate-400"
              />
            ) : null}
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none placeholder:text-slate-400"
            />
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-3 text-white outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-coral px-4 py-3 font-medium text-slate-950 transition hover:brightness-105 disabled:opacity-70"
          >
            {loading ? "Working..." : mode === "login" ? "Enter TaskFlow" : "Start building momentum"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default LandingPage;
