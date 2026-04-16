import { useEffect, useMemo } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import {
  createTask,
  deleteTask,
  fetchTasks,
  reorderTasks,
  selectTaskFilters,
  selectTasks,
  setFilters,
  updateTask,
} from "../features/tasks/tasksSlice";

const TasksPage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const filters = useSelector(selectTaskFilters);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const categories = useMemo(
    () => ["all", ...new Set(tasks.map((task) => task.category).filter(Boolean))],
    [tasks],
  );

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    dispatch(reorderTasks(reordered.map((task) => task._id)));
  };

  const handleToggle = (task) => {
    dispatch(
      updateTask({
        id: task._id,
        updates: { status: task.status === "completed" ? "pending" : "completed" },
      }),
    );
  };

  return (
    <div className="space-y-6">
      <TaskForm onSubmit={(payload) => dispatch(createTask(payload))} />

      <section className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-4 shadow-panel md:grid-cols-4">
        <input
          value={filters.search}
          onChange={(event) => dispatch(setFilters({ search: event.target.value }))}
          placeholder="Search tasks"
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none placeholder:text-slate-400"
        />
        <select
          value={filters.status}
          onChange={(event) => dispatch(setFilters({ status: event.target.value }))}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
        >
          {["all", "pending", "completed", "overdue"].map((value) => (
            <option key={value} className="text-slate-950">
              {value}
            </option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(event) => dispatch(setFilters({ priority: event.target.value }))}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
        >
          {["all", "High", "Medium", "Low"].map((value) => (
            <option key={value} className="text-slate-950">
              {value}
            </option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(event) => dispatch(setFilters({ category: event.target.value }))}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white outline-none"
        >
          {categories.map((value) => (
            <option key={value} className="text-slate-950">
              {value}
            </option>
          ))}
        </select>
      </section>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4 xl:grid-cols-2"
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        onToggle={handleToggle}
                        onDelete={(id) => dispatch(deleteTask(id))}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TasksPage;
