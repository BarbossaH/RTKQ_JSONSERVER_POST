import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState();
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (responseData) => {
        return userAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => {
        console.log(result);
        return [
          { type: 'User', id: 'LIST' },
          ...result.ids.map((id) => ({ type: 'User', id })),
        ];
      },
    }),
  }),
});

//set up the api
export const { useGetUsersQuery } = userApiSlice;

//set up the selector via api
// returns the query result object
export const selectUserResult = userApiSlice.endpoints.getUsers.select();

const selectUserData = createSelector(
  selectUserResult,
  (userResult) => userResult.data
);

export const {
  selectAll: getAllUsersState,
  selectById: getUserStateById,
  selectIds: getUserId,
} = userAdapter.getSelectors((state) => selectUserData(state) ?? initialState);
