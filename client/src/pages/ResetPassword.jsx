// resetPassword.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

function ResetPassword() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Make an HTTP POST request to the reset password endpoint
      const response = await axiosInstance.post(
        "/api/users/reset-password",
        values,
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Navigate to the login page after successful password reset
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.data.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card w-400 p-4">
        <h1 className="text-xl text-center">Reset Password</h1>
        <hr />
        <div className="p-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                // Add email format validation if needed
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>

            {/* Additional fields for new password and confirmation */}
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "New password is required",
                },
                // Add password format validation if needed
              ]}
              hasFeedback
            >
              <Input.Password type="password" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password type="password" autoComplete="off" />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Link className="" to="/login">
                Back to Login
              </Link>
              <button type="submit" className="secondary">
                Reset Password
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
