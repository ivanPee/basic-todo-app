import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    todos: [],
    filteredTodo: [],
    textInput: null,
    search: null,
}

export const counterSlice = createSlice({
    name: 'todoData',
    initialState,
    reducers: {
        setTodos: (state, action) => {
            state.todos = action.payload
        },
        setFilteredTodo: (state, action) => {
            state.filteredTodo = action.payload
        },
        setTextInput: (state, action) => {
            state.textInput = action.payload
        },
        setSearch: (state, action) => {
            state.search = action.payload
        },
    },
})

export const { setTodos, setTextInput, setSearch, setFilteredTodo } = counterSlice.actions

export default counterSlice.reducer