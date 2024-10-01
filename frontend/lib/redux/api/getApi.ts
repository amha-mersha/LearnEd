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
        }),
        postGrades: builder.mutation({
            query: ({ data, token }) => ({
                url: `/bookmarks`,
                method: 'PUT',
                headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: data,
            }),
          }),
    }),
})

export const {useSignUpMutation, usePostGradesMutation} = learnApi;
