import { combineReducers, configureStore } from "@reduxjs/toolkit";
import alertsSlice from "./alertsSlice";
import usersSlice from "./usersSlice";

const rootReducer = combineReducers({
  alerts: alertsSlice,
  users:usersSlice
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

//why  v use usersSlice bcoz whenever v refersh the page the logic in protected route will be
// executed which is nothing but validate token so v will get the user object from bckend
// so whenever v get that i want to put data in reducer
// so go  in protectedRoute.js line no 7
