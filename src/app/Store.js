import { configureStore, createSlice } from "@reduxjs/toolkit";
import userReducer from "../entities/user/userSlise.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
