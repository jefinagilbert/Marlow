import { createSlice } from '@reduxjs/toolkit';

const currentIdSlice = createSlice({
  name: 'currentId',
  initialState: {
    id: null,
  },
  reducers: {
    setCurrentId: (state, action) => {
      state.id = action.payload;
    },
    clearCurrentId: (state) => {
      state.id = null;
    },
  },
});

export const { setCurrentId, clearCurrentId } = currentIdSlice.actions;
export default currentIdSlice.reducer;
