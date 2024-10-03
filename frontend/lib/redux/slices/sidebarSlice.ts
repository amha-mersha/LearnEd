import { createSlice } from "@reduxjs/toolkit";

export const sidebarSlice = createSlice({
    name: 'hamburger',
    initialState:  { value: true },
    reducers: {
        collapse(state) {
            state.value = false
        }, 
        relax(state){
            state.value = true
        }
    }
})

export const { collapse, relax } = sidebarSlice.actions;
export default sidebarSlice.reducer
