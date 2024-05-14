import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout/Layout.js";
import LeaderboardPage from './Pages/LeaderboardPage.js';
import CreateLeaderboardPage from './Pages/CreateLeaderboardPage.js';
import ProfilePage from './Pages/ProfilePage.js';
const router = createBrowserRouter([
  {
  path: "/",
  element: <Layout />,
  children:[
    {
      path: "/leaderboard",
      element: <LeaderboardPage />
    },
    {
      path: "/create",
      element: <CreateLeaderboardPage />
    },
    {
      path: "/profile",
      element : <ProfilePage />
    }
  ]
}
  ]
      
    
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
