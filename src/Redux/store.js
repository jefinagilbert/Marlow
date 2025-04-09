import { configureStore } from '@reduxjs/toolkit';
import currentIdReducer from './currentIdSlice';

const store = configureStore({
  reducer: {
    currentId: currentIdReducer,
  },
});

export default store;