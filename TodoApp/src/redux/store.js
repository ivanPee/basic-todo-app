import { configureStore } from '@reduxjs/toolkit';
import TodoDataSlice from './counterSlice';

export const Store = configureStore ({
    reducer: {
        todoData: TodoDataSlice
    }
})