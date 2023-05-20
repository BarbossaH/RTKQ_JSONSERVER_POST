import { useState } from 'react';
import Layout from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import PostList from './components/posts/PostList';
import PostAdd from './components/posts/PostAdd';
import PostSinglePage from './components/posts/PostSinglePage';
import PostEdit from './components/posts/PostEdit';
import UserLister from './components/users/UserLister';
import UserPage from './components/users/UserPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PostList />}></Route>

        <Route path="post">
          <Route index element={<PostAdd />} />
          <Route path=":postId" element={<PostSinglePage />} />
          <Route path="edit/:postId" element={<PostEdit />} />
        </Route>
        <Route path="user">
          <Route index element={<UserLister />}></Route>
          <Route path=":userId" element={<UserPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
