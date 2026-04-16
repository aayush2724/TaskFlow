import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    current: localStorage.getItem("taskflow-theme") || "dark",
  },
  reducers: {
    setTheme(state, action) {
      state.current = action.payload;
      localStorage.setItem("taskflow-theme", action.payload);
    },
    applyTheme(state, action) {
      const theme = action.payload || state.current;
      document.documentElement.dataset.theme = theme;
      document.body.classList.toggle("light", theme === "light");
    },
  },
});

export const { setTheme, applyTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.current;

export default themeSlice.reducer;
