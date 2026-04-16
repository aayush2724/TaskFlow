import { useMemo, useState } from "react";

const defaultState = {
  title: "",
  description: "",
  priority: "Medium",
  category: "General",
  dueDate: "",
  tags: "",
};

const TaskForm = ({ onSubmit, submitting }) => {
  const [values, setValues] = useState(defaultState);
  const categories = useMemo(() => ["General", "Work", "Personal", "Health", "Learning"], []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setValues(defaultState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-4 shadow-panel backdrop-blur lg:grid-cols-2">
      <input
        required
        name="title"
        value={values.title}
        onChange={handleChange}
        placeholder="Plan sprint review"
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-slate-400"
      />
      <select
        name="priority"
        value={values.priority}
        onChange={handleChange}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
      >
        <option className="text-slate-950">Low</option>
        <option className="text-slate-950">Medium</option>
        <option className="text-slate-950">High</option>
      </select>
      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="What good looks like"
        className="min-h-28 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-slate-400 lg:col-span-2"
      />
      <select
        name="category"
        value={values.category}
        onChange={handleChange}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
      >
        {categories.map((category) => (
          <option key={category} className="text-slate-950">
            {category}
          </option>
        ))}
      </select>
      <input
        name="dueDate"
        type="date"
        value={values.dueDate}
        onChange={handleChange}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
      />
      <input
        name="tags"
        value={values.tags}
        onChange={handleChange}
        placeholder="focus, sprint, personal"
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-slate-400 lg:col-span-2"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-teal px-4 py-2 font-medium text-slate-950 transition hover:bg-mint disabled:cursor-not-allowed disabled:opacity-70 lg:col-span-2"
      >
        {submitting ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
