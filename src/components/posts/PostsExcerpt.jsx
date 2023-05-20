import { useSelector } from 'react-redux';
import { getPostStateById } from '../../api/postSlice';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import TimeAgo from '../utils/TimeAgo';
import Reactions from '../utils/Reactions';

const PostsExcerpt = ({ postId }) => {
  const post = useSelector((state) => getPostStateById(state, postId));
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <Reactions post={post} />
    </article>
  );
};
export default PostsExcerpt;
