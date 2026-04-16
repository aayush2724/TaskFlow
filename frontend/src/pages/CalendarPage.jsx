import { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, selectTasks } from "../features/tasks/tasksSlice";

const CalendarPage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-4 shadow-panel">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={tasks
          .filter((task) => task.dueDate)
          .map((task) => ({
            id: task._id,
            title: task.title,
            date: task.dueDate,
            color: task.status === "completed" ? "#72f0c3" : "#ff7a59",
          }))}
      />
    </div>
  );
};

export default CalendarPage;
