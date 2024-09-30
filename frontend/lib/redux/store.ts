import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./slices/sidebarSlice";

export const store = configureStore({
    reducer: {
        hamburger: sidebarSlice
    }
})