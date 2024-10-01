import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: 'token',
    initialState:  { accessToken: "" },
    reducers: {
        settoken: (state, accessToken) => {
            state.accessToken = accessToken.payload
        }, 
        unsettoken: (state) => {
            state.accessToken = ""
        }
    }
})

export const { settoken, unsettoken } = tokenSlice.actions;
export default tokenSlice.reducer
