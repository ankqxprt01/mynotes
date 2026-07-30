import { message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const validateToken = async () => {
    try {
      dispatch(ShowLoading());

      const response = await axiosInstance.post(
        "/api/users/get-user-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      dispatch(HideLoading());

      if (response.data.success) {
        dispatch(SetUser(response.data.data));
      } else {
        throw new Error("Invalid token");
      }
    } catch (error) {
      dispatch(HideLoading());

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");

      message.error("Session expired. Please login again.");

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      validateToken();
    } else {
      navigate("/login");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default ProtectedRoute;
