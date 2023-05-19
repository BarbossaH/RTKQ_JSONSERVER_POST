import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//here, we will separate the users and posts api
export const apiSlice = createApi({
  reducerPath: 'api', //optional
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  tagTypes: ['POST'],
  endpoints: (builder) => ({}),
});
