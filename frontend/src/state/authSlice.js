import {createSlice} from '@reduxjs/toolkit';

const storedAuth = JSON.parse(localStorage.getItem("auth"));


const initialState = storedAuth || {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
    },
  },
});

export default authSlice.reducer;
export const {login} = authSlice.actions;
