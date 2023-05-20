import { useSelector } from 'react-redux';
import { getAllUsersState } from '../../api/userSlice';
import { Link } from 'react-router-dom';

const PostAuthor = ({ userId }) => {
  const users = useSelector(getAllUsersState);
  const author = users.find((user) => user.id === userId);
  return (
    <span>
      by{' '}
      {author ? <Link to={`/user/${userId}`}>{author.name}</Link> : 'Someone'}
    </span>
  );
};
export default PostAuthor;
