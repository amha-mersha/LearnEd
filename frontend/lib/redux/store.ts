import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./slices/sidebarSlice";
import { learnApi } from "./api/getApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [learnApi.reducerPath]: learnApi.reducer,
        hamburger: sidebarSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(learnApi.middleware),
})

setupListeners(store.dispatch)