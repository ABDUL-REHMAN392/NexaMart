

import { createSlice } from "@reduxjs/toolkit";

const conditionSlices = createSlice({
  name: "condition",
  initialState: { Menu: false },
  reducers: {
    showMenu: (state) => {
      state.Menu = true;
    },
    hideMenu: (state) => {
      state.Menu = false;
    },
  },
});

export const { showMenu, hideMenu } = conditionSlices.actions;
export const conditionReducer = conditionSlices.reducer;
