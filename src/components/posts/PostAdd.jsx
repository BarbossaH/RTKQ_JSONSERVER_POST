import { useNavigate } from 'react-router-dom';
import { useAddNewPostMutation } from '../../api/postSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllUsersState } from '../../api/userSlice';

const PostAdd = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const users = useSelector(getAllUsersState);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onChooseAuthor = (e) => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const handleSavePost = async () => {
    if (!canSave) return;
    try {
      //why is it?? remember it
      await addNewPost({ title, body: content, userId }).unwrap();
      setTitle('');
      setContent('');
      setUserId('');
      navigate('/');
    } catch (error) {
      console.error('Failed to save the post', error);
    }
  };
  const usersOptions = users.map((user) => (
    // console.log(user);
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  console.log(usersOptions);
  return (
    <div>
      <h2>Add a new post</h2>
      <form action="">
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          name="postAuthor"
          id="postAuthor"
          value={userId}
          onChange={onChooseAuthor}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChanged}
          cols="30"
          rows="10"
        ></textarea>
        <button type="button" onClick={handleSavePost} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </div>
  );
};
export default PostAdd;
