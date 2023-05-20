import { useSelector } from 'react-redux';
import { getAllPostIds, useGetPostsQuery } from '../../api/postSlice';
import PostsExcerpt from './PostsExcerpt';

const PostList = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const orderedPostIds = useSelector(getAllPostIds);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }
  return <div>{content}</div>;
};
export default PostList;
