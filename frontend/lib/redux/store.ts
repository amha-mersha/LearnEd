import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import sidebarSlice from "./slices/sidebarSlice";
import { learnApi } from "./api/getApi";

export const store = configureStore({
    reducer: {
        [learnApi.reducerPath]: learnApi.reducer,
        hamburger: sidebarSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(learnApi.middleware),
})

setupListeners(store.dispatch)