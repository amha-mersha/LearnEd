import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const learnApi = createApi({
  reducerPath: "LearnEdApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/v1/" }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),
    createClassroom: builder.mutation({
      query: ({ data, accessToken }) => ({
        url: "classrooms/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    getClassrooms: builder.query({
      query: (accessToken) => ({
        url: "classrooms/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
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
});

export const {
  useSignUpMutation,
  useCreateClassroomMutation,
  useGetClassroomsQuery,
  usePostGradesMutation
} = learnApi;
