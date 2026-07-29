import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, message, Card, Typography, Button, Flex } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Title } = Typography;

function ResetPassword() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/reset-password",
        values,
      );

      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Flex justify="center" align="center" className="reset-container">
      <Card className="reset-card">
        <Title
          level={3}
          style={{
            textAlign: "center",
          }}
        >
          Reset Password
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Enter a valid email",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "New password is required",
              },
              {
                min: 4,
                message: "Password must be at least 4 characters",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Enter new password"
              autoComplete="off"
            />
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
            <Input.Password placeholder="Confirm password" autoComplete="off" />
          </Form.Item>

          <Flex justify="space-between" align="center">
            <Link to="/login">Back to Login</Link>

            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
}

export default ResetPassword;
