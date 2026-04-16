import { CheckCircle2, Circle, Flame, Trash2 } from "lucide-react";

const priorityColors = {
  High: "text-coral",
  Medium: "text-sun",
  Low: "text-mint",
};

const TaskCard = ({ task, onToggle, onDelete }) => (
  <div className="rounded-lg border border-white/10 bg-slate-950/40 p-4 shadow-panel backdrop-blur">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase ${priorityColors[task.priority] || "text-mint"}`}>
            {task.priority}
          </span>
          <span className="text-xs text-slate-400">{task.category}</span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-white">{task.title}</h3>
        {task.description ? <p className="mt-2 text-sm text-slate-300">{task.description}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onDelete(task._id)}
        className="rounded-md border border-white/10 p-2 text-slate-300 transition hover:border-coral hover:text-coral"
      >
        <Trash2 size={16} />
      </button>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
      {task.tags?.map((tag) => (
        <span key={tag} className="rounded-md bg-white/8 px-2 py-1">
          #{tag}
        </span>
      ))}
      {task.dueDate ? <span>Due {new Date(task.dueDate).toLocaleDateString()}</span> : <span>No due date</span>}
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="inline-flex items-center gap-2 text-sm text-slate-300">
        <Flame size={16} className="text-sun" />
        {task.status === "completed" ? "Completed" : "In progress"}
      </div>
      <button
        type="button"
        onClick={() => onToggle(task)}
        className="inline-flex items-center gap-2 rounded-md bg-white/8 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/14"
      >
        {task.status === "completed" ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        {task.status === "completed" ? "Done" : "Complete"}
      </button>
    </div>
  </div>
);

export default TaskCard;
