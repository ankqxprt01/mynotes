import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import About from "./pages/About";
import UsersNote from "./pages/UsersNote";
import ResetPassword from "./pages/ResetPassword";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import UserProfile from "./pages/UserProfile";
// import AdminUserList from "./components/AdminUserList";
import AdminNotes from "./pages/Admin/AdminNotes";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminusersNote from "./pages/Admin/AdminusersNote";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      {loading && <Loader />}
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/users-notes"
            element={
              <ProtectedRoute>
                <UsersNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-notes"
            element={
              <ProtectedRoute>
                <AdminNotes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-users-notes"
            element={
              <ProtectedRoute>
                <AdminusersNote />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
