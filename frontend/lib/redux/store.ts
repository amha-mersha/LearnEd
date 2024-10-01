import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import sidebarSlice from "./slices/sidebarSlice";
import  authSlice from "./slices/roleSlice";
import { learnApi } from "./api/getApi";
import roleSlice from "./slices/roleSlice";
import tokenSlice from "./slices/tokenSlice";

export const store = configureStore({
    reducer: {
        [learnApi.reducerPath]: learnApi.reducer,
        hamburger: sidebarSlice,
        role: roleSlice,
        token: tokenSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(learnApi.middleware),
})

setupListeners(store.dispatch)