import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getPostStateById } from '../../api/postSlice';
import PostAuthor from './PostAuthor';
import TimeAgo from '../utils/TimeAgo';
import Reactions from '../utils/Reactions';

const PostSinglePage = () => {
  const { postId } = useParams();
  const post = useSelector((state) => getPostStateById(state, Number(postId)));
  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="postCredit">
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <Reactions post={post} />
    </div>
  );
};
export default PostSinglePage;
