import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getPostStateById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from '../../api/postSlice';
import { getAllUsersState } from '../../api/userSlice';
import { useState } from 'react';

const PostEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const post = useSelector((state) => getPostStateById(state, Number(postId)));
  const users = useSelector(getAllUsersState);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);

  if (!post) {
    return (
      <section>
        <h2>Post doesn't exist</h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const handleSavePost = () => {
    if (!canSave) return;
    try {
      updatePost({
        id: post.id,
        title,
        body: content,
        userId,
        reactions: post.reactions,
      });
      // setTitle('');
      // setContent('');
      // setUserId('');
      setInitStates();
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('there is an error', error);
    }
  };

  function setInitStates(url) {
    setTitle('');
    setContent('');
    setUserId('');
    // navigate(url);
  }
  const usersOptions = users.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));

  const handleDeletePost = async () => {
    try {
      await deletePost({ id: post.id }).unwrap();
      setInitStates();
      navigate('/');
    } catch (error) {
      console.error('delete failed', error);
    }
  };
  return (
    <div>
      <h2>Edit Post</h2>
      <form action="">
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author: </label>
        <select
          name="postAuthor"
          id="postAuthor"
          value={userId}
          onChange={onAuthorChanged}
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
        <button
          className="deleteButton"
          type="button"
          onClick={handleDeletePost}
        >
          Delete Post
        </button>
      </form>
    </div>
  );
};
export default PostEdit;
