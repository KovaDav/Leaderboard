import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout/Layout";
import LeaderboardPage from './Pages/LeaderboardPage';
import CreateLeaderboardPage from './Pages/CreateLeaderboardPage';
import ProfilePage from './Pages/ProfilePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';

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
        element: <ProtectedRoute element={CreateLeaderboardPage} />
      },
      {
        path: "/profile",
        element : <ProtectedRoute element={ProfilePage} />
      },
      {
        path: "/login",
        element : <LoginPage />
      },
      {
        path: "/register",
        element : <RegisterPage />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
