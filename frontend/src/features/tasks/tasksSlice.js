import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";
import client from "../../api/client";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (filters, thunkApi) => {
  try {
    const { data } = await client.get("/tasks", { params: filters });
    return data.tasks;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to load tasks");
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (payload, thunkApi) => {
  try {
    const { data } = await client.post("/tasks", payload);
    toast.success("Task created");
    return data.task;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to create task");
  }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, updates }, thunkApi) => {
  try {
    const { data } = await client.put(`/tasks/${id}`, updates);
    if (data.reward) {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      toast.success(`+${data.reward.xpGain} XP`);
    }
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to update task");
  }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, thunkApi) => {
  try {
    await client.delete(`/tasks/${id}`);
    toast.info("Task deleted");
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to delete task");
  }
});

export const reorderTasks = createAsyncThunk("tasks/reorderTasks", async (orderedIds, thunkApi) => {
  try {
    const { data } = await client.put("/tasks/reorder", { orderedIds });
    return data.tasks;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to reorder tasks");
  }
});

export const fetchAnalytics = createAsyncThunk("tasks/fetchAnalytics", async (_, thunkApi) => {
  try {
    const { data } = await client.get("/analytics");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to load analytics");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    analytics: null,
    loading: false,
    analyticsLoading: false,
    error: null,
    filters: {
      status: "all",
      priority: "all",
      category: "all",
      search: "",
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.task;
        const index = state.items.findIndex((task) => task._id === updatedTask._id);
        if (index >= 0) {
          state.items[index] = updatedTask;
        }
        if (state.analytics && action.payload.reward) {
          state.analytics.streaks = {
            ...state.analytics.streaks,
            ...action.payload.reward,
          };
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters } = tasksSlice.actions;
export const selectTasks = (state) => state.tasks.items;
export const selectTaskFilters = (state) => state.tasks.filters;
export const selectAnalytics = (state) => state.tasks.analytics;

export default tasksSlice.reducer;
