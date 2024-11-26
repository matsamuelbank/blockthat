import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: {
      isAuthenticated: false,
    },
  },
  reducers: {
    addUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload, isAuthenticated: true };
    },
    clearUserInfo: (state) => {
      state.userInfo = { isAuthenticated: false };
    },
  },
});

export default authSlice.reducer;
export const { addUserInfo, clearUserInfo } = authSlice.actions;