import {createSlice} from '@reduxjs/toolkit';   
// showing and hiding loading whenever api is in processing state
const alertsSlice = createSlice({
  name: "alerts",
  initialState: {
    // v r going to control from this loading to entire appln whenever v hit api this loading will be true.
    // when its true v will show loading i.e spinners
    loading: false,
  },
  reducers: {
    ShowLoading: (state, action) => {
      state.loading = true;
    },
    HideLoading: (state, action) => {
      state.loading = false;
    },
  },
});


export const {ShowLoading, HideLoading}= alertsSlice.actions;
export default alertsSlice.reducer;