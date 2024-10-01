import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const learnApi = createApi({
    reducerPath: 'LearnEdApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8080/api/v1/'}),
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (data) => ({
                url: 'auth/signup',
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: data
            })
        })
    }),
})

export const {useSignUpMutation} = learnApi;
