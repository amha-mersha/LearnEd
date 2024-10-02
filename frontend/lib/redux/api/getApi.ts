import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const learnApi = createApi({
  reducerPath: "LearnEdApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/v1/"}),
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
      query: ({ class_id, student_id, token, data }) => (
        console.log("dd", data, token),
        {
          url: `classrooms/${class_id}/grades/${student_id}`,
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
      query: ({id, token}) => ({
        url: `classrooms/${id}/grades`,
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
        body: data,
      }),
    }),

    //---------------------------------Posts---------------------------------
    getPosts: builder.query({
      query: ({classroomId,accessToken}) => ({
        url: `classrooms/${classroomId}/posts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    createPost: builder.mutation({
      query: ({classroomId,accessToken, data}) => ({
        url: `classrooms/${classroomId}/posts`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),

    updatePost: builder.mutation({
      query: ({classroomId, postId, accessToken, data}) => ({
        url: `/${classroomId}/posts/${postId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),

    deletePost: builder.mutation({
      query: ({classroomId, postId, accessToken, data}) => ({
        url: `/${classroomId}/posts/${postId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    //---------------------------------Comments---------------------------------
    addComment: builder.mutation({
      query: ({classroomId, postId, accessToken, data}) => ({
        url: `/${classroomId}/posts/${postId}/comments`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),

    removeComment: builder.mutation({
      query: ({classroomId, postId, commentId, accessToken}) => ({
        url: `/${classroomId}/posts/${postId}/comments/${commentId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useCreateClassroomMutation,
  useGetClassroomsQuery,
  usePostGradesMutation,
  useGetAllStudentsQuery,
  useGetStudentGradesQuery,
  
  useCreatePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,

  useAddCommentMutation,
  useRemoveCommentMutation,
  useGetStudyGroupsQuery,
  useCreateStudyGroupMutation,
} = learnApi;
