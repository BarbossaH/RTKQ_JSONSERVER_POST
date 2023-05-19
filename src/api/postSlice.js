import { createEntityAdapter } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { apiSlice } from './apiSlice';

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        //here, to initiate the post data formate and use adapter to manage the state to avoid the potential performance issues
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      //provide tags as an array, if any of the objects in the array are invalidated, it will refetch the data(getPosts)
      providesTags: (result, error, arg) => [
        { type: 'POST', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'POST', id })),
      ],
    }),
  }),
});

export const { useGetPostsQuery } = extendedApiSlice;

export const {
  selectAll: getAllPostsState,
  selectById: getPostStateById,
  selectIds: getAllPostIds,
  // pass in a selector that returns the all posts' state
} = postsAdapter.getSelectors((state) => state.posts);
