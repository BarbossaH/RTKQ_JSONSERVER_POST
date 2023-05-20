import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getUserStateById } from '../../api/userSlice';
import { useGetPostByUserIdQuery } from '../../api/postSlice';
import { id } from 'date-fns/locale';

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => getUserStateById(state, Number(userId)));

  //get the posts of the corresponding user
  const {
    data: postsFromUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostByUserIdQuery(userId);
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    //because the postFromUser has been normalized
    // console.log(postsFromUser);
    const { ids, entities } = postsFromUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <div>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </div>
  );
};
export default UserPage;
