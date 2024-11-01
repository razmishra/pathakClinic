import { createSlice } from "@reduxjs/toolkit";

const sessionReducersSlice = createSlice({
  name: "userSession",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    login: (state,actions) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const sessionActions = sessionReducersSlice.actions;

export default sessionReducersSlice.reducer;
