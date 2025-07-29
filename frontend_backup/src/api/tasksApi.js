import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to get a new token using refresh token if available
    const { auth } = api.getState();
    if (auth.refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: 'token/refresh/',
          method: 'POST',
          body: { refresh: auth.refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new token
        api.dispatch(setCredentials(refreshResult.data));
        // Retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - log out
        api.dispatch(logout());
      }
    } else {
      // No refresh token available - log out
      api.dispatch(logout());
    }
  }
  return result;
};

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => 'tasks/',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task', id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: 'tasks/',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `tasks/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        {
          type: 'Task',
          id,
        },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        {
          type: 'Task',
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
