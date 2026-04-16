import { useEffect, useMemo, useState } from "react";

const PomodoroPage = () => {
  const sessions = useMemo(
    () => [
      { label: "Focus", value: 25 * 60 },
      { label: "Short Break", value: 5 * 60 },
      { label: "Deep Work", value: 50 * 60 },
    ],
    [],
  );
  const [selected, setSelected] = useState(sessions[0]);
  const [secondsLeft, setSecondsLeft] = useState(selected.value);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(selected.value);
    setRunning(false);
  }, [selected]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, secondsLeft]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((selected.value - secondsLeft) / selected.value) * 100;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <section className="rounded-lg border border-white/10 bg-slate-950/35 p-6 shadow-panel">
        <div className="flex flex-wrap gap-2">
          {sessions.map((session) => (
            <button
              key={session.label}
              type="button"
              onClick={() => setSelected(session)}
              className={`rounded-md px-4 py-2 text-sm ${
                selected.label === session.label ? "bg-teal text-slate-950" : "bg-white/8 text-white"
              }`}
            >
              {session.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <div className="text-sm text-slate-300">{selected.label}</div>
          <div className="mt-4 text-7xl font-semibold text-white">
            {minutes}:{seconds}
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/8">
            <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setRunning((current) => !current)}
              className="rounded-md bg-coral px-4 py-2 font-medium text-slate-950"
            >
              {running ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(selected.value);
              }}
              className="rounded-md border border-white/10 px-4 py-2 text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-white/10 bg-slate-950/35 p-6 shadow-panel">
        <h3 className="text-lg font-semibold text-white">Focus rhythm</h3>
        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <p>Pick a session, clear one task from your list, and keep the timer visible while you work.</p>
          <p>When the block ends, log a quick win in your task notes or mark something complete to keep the streak moving.</p>
        </div>
      </section>
    </div>
  );
};

export default PomodoroPage;
