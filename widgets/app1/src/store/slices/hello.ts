import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  greeting: 'Hello galactic explorer!',
};

export const helloSlice = createSlice({
  name: 'hello',
  initialState,
  reducers: {
    changeGreeting: (state, action) => {
      state.greeting = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeGreeting } = helloSlice.actions;

export default helloSlice.reducer;
