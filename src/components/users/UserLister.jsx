import { useSelector } from 'react-redux';
import { getAllUsersState } from '../../api/userSlice';
import { Link } from 'react-router-dom';

const UserLister = () => {
  const users = useSelector(getAllUsersState);

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/user/${user.id}`}>{user.name}</Link>
    </li>
  ));
  return (
    <div>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </div>
  );
};
export default UserLister;
