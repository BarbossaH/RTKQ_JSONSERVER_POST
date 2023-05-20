import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import { extendedApiSlice } from './api/postSlice.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { userApiSlice } from './api/userSlice.js';

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(userApiSlice.endpoints.getUsers.initiate());
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
