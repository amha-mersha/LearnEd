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
          Authorization: `Bearer ${accessToken}`,
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
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    postGrades: builder.mutation({
      query: ({ data, token }) => (
        console.log("dd", data, token),
        {
          url: `classrooms/66f32f5b448485ed1dca27fd/grades/66f3fe604adcefd5d8830a6c`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      ),
    }),
    getAllStudents: builder.query({
      query: (token) => ({
        url: `classrooms/66f32f5b448485ed1dca27fd/grades`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getStudentGrades: builder.query({
      query: ({ studentId, accessToken }) => ({
        url: `classrooms/grades/${studentId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getStudyGroups: builder.query({
      query: (accessToken) => ({
        url: `study-groups/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    createStudyGroup: builder.mutation({
      query: ({data, accessToken}) => ({
        url: 'study-groups/',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data
      })
    })
  }),
});

export const {
  useSignUpMutation,
  useCreateClassroomMutation,
  useGetClassroomsQuery,
  usePostGradesMutation,
  useGetAllStudentsQuery,
  useGetStudentGradesQuery,
  useGetStudyGroupsQuery
} = learnApi;
