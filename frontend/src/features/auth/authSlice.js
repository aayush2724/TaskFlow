import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import client from "../../api/client";

const storedToken = localStorage.getItem("taskflow-token");

export const register = createAsyncThunk("auth/register", async (payload, thunkApi) => {
  try {
    const { data } = await client.post("/auth/register", payload);
    localStorage.setItem("taskflow-token", data.token);
    toast.success("Welcome to TaskFlow");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const login = createAsyncThunk("auth/login", async (payload, thunkApi) => {
  try {
    const { data } = await client.post("/auth/login", payload);
    localStorage.setItem("taskflow-token", data.token);
    toast.success("Logged in");
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkApi) => {
  if (!localStorage.getItem("taskflow-token")) {
    return thunkApi.rejectWithValue("No token");
  }

  try {
    const { data } = await client.get("/auth/me");
    return { user: data.user, token: localStorage.getItem("taskflow-token") };
  } catch (error) {
    localStorage.removeItem("taskflow-token");
    return thunkApi.rejectWithValue(error.response?.data?.message || "Session expired");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, thunkApi) => {
  try {
    const { data } = await client.put("/auth/profile", payload);
    toast.success("Profile updated");
    return data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.message || "Profile update failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: storedToken,
    ready: !storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.ready = true;
      localStorage.removeItem("taskflow-token");
      toast.info("Signed out");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.ready = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.ready = true;
        toast.error(action.payload);
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.ready = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.ready = true;
        toast.error(action.payload);
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.ready = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.ready = true;
        state.user = null;
        state.token = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user);
export const selectAuthReady = (state) => state.auth.ready;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
