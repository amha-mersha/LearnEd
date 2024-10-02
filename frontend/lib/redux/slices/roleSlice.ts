import { createSlice } from "@reduxjs/toolkit";
import { Session } from "next-auth";

export const roleSlice = createSlice({
    name: 'role',
    initialState:  { role: "" },
    reducers: {
        setrole: (state, role) => {
            state.role = role.payload
        }, 
        unsetrole: (state) => {
            state.role = ""
        }
    }
})

export const { setrole, unsetrole } = roleSlice.actions;
export default roleSlice.reducer
