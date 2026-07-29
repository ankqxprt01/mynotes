import { message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Navbar from "./Navbar";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);

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
        // console.log("API response:", response.data);
        dispatch(SetUser(response.data.data));
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoading());

      console.log(error);

      localStorage.removeItem("token");

      message.error(error.message);

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoute;
