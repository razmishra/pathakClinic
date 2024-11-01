import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./reducers/sessionReducer";

export const store = configureStore({
  reducer: {
    userSession: sessionReducer,
  },
});
