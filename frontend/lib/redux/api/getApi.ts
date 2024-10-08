import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const learnApi = createApi({
  reducerPath: "LearnEdApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://learned-ci09.onrender.com" }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "auth/login",
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
      query: ({ class_id, student_id, token, data }) => ({
        url: `classrooms/${class_id}/grades/${student_id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
    }),
    getAllStudents: builder.query({
      query: ({ id, token }) => ({
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
      query: ({ data, accessToken }) => ({
        url: "study-groups/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    inviteToStudyGroup: builder.mutation({
      query: ({ studyGroupId, data, accessToken }) => ({
        url: `study-groups/${studyGroupId}/students`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    getPosts: builder.query({
      query: ({ classroomId, accessToken }) => ({
        url: `classrooms/${classroomId}/posts`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    createPost: builder.mutation({
      query: ({ classroomId, accessToken, data }) => ({
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
      query: ({ classroomId, postId, accessToken, data }) => ({
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
      query: ({ classroomId, postId, accessToken, data }) => ({
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
      query: ({ classroomId, postId, accessToken, data }) => ({
        url: `classrooms/${classroomId}/posts/${postId}/comments`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    removeComment: builder.mutation({
      query: ({ classroomId, postId, commentId, accessToken }) => ({
        url: `/${classroomId}/posts/${postId}/comments/${commentId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    getQuiz: builder.query({
      query: ({ token, id }) => ({
        url: `classrooms/posts/get_quiz/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    postContent: builder.mutation({
      query: ({ classroomId, data, accessToken }) => ({
        url: `classrooms/${classroomId}/posts`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      }),
    }),
    enhanceContent: builder.mutation({
      query: ({ currentState, accessToken }) => ({
        url: `classrooms/enhance_content`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          current_state: currentState,
          query:
            "Please expand on this assignment description to make it clearer and more comprehensive. Focus on providing detailed guidance, including key objectives, expected outcomes, and specific instructions, ensuring it is more structured and informative for students. Your response should be at most 100 words",
        },
      }),
    }),
    getFlashcards: builder.query({
      query: ({ postId, accessToken }) => ({
        url: `classrooms/posts/get_flashcard/${postId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    // inviteToStudyGroup: builder.mutation({
    //   query: ({studyGroupId, data, accessToken }) => ({
    //     url: `study-groups/${studyGroupId}/students`,
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     body: data,
    //   })
    // }),
    inviteToClassrooms: builder.mutation({
      query: ({ classroomId, data, accessToken }) => ({
        url: `classrooms/${classroomId}/students`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
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
  useGetStudyGroupsQuery,
  useCreateStudyGroupMutation,
  useLoginMutation,
  useCreatePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useRemoveCommentMutation,
  useGetQuizQuery,
  usePostContentMutation,
  useEnhanceContentMutation,
  useGetFlashcardsQuery,
  useInviteToStudyGroupMutation,
  useInviteToClassroomsMutation,
} = learnApi;
