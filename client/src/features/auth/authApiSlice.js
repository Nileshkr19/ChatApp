import { apiSlice } from "../../features/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    authStatus: builder.query({
      query: () => ({
        url: "/users/me", 
        method: "GET",
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation, useLogoutMutation,useAuthStatusQuery } =
  authApiSlice;
