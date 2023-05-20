import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
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
        { type: 'Posts', id: 'LIST' },
        ...result.ids.map((id) => ({ type: 'Posts', id })),
      ],
    }),
    getPostByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
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
          // to ensure the data format is the same and correct
          return post;
        });
        //after get the formatted data and then give it to the adapter to manage
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        //result is the data fetched from the server through createAsyncThunk function
        // console.log(result);
        return [...result.ids.map((id) => ({ type: 'Posts', id }))];
      },
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: {
          //the structure based on json format
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => {
        console.log(arg);
        return [{ type: 'Posts', id: arg.id }];
      },
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Posts', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        //actually the same user cannot add the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            'getPosts',
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

//return the query result object
export const selectPostResult = extendedApiSlice.endpoints.getPosts.select();

//creates memoized selector
const selectPostsData = createSelector(
  selectPostResult,
  (postsResult) => postsResult.data //normalized state object with ids & entities
);

export const {
  selectAll: getAllPostsState,
  selectById: getPostStateById,
  selectIds: getAllPostIds,
  // pass in a selector that returns the all posts' state
  // } = postsAdapter.getSelectors((state) => state.posts);
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);

/** Using adapters, we can normalize the management of data, reduce unnecessary rendering, and create selectors that can decouple the state of posts from the adapter.
 */
