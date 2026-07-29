import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Input, Form, Row, Col } from "antd";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { SetUser } from "../redux/usersSlice"; // Import the action to set user info

const UpdateName = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.user); // Get user from Redux store
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [form] = Form.useForm();

  const handleUpdateName = async () => {
    if (!email || !newName) {
      message.error("Email and name can't be empty");
      return;
    }

    dispatch(ShowLoading()); // Show loading indicator

    try {
      const response = await axiosInstance.post("/api/users/updateName", {
        email: email,
        newName: newName,
      });
      if (response.status === 200 && response.data.success) {
        message.success("Name updated successfully");
        // Update user's name in Redux store
        dispatch(SetUser({ ...user, name: newName }));
        form.resetFields();
      } else {
        message.error(
          "Failed to update name. Please check your email or password."
        );
      }
    } catch (error) {
      message.error({
        content: error.response.data.message,
      });
    } finally {
      dispatch(HideLoading()); // Hide loading indicator regardless of success or failure
    }
  };

  return (
    <>
      <Form layout="vertical" form={form}>
        <Row gutter={[10, 10]}>
          <Col lg={12} xs={24}>
            <Form.Item
              name="email"
              type="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email",
                },
              ]}
              hasFeedback
            >
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter new name",
                },
              ]}
              hasFeedback
            >
              <Input
                placeholder="New Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <button
              className="secondary"
              style={{ display: "block", margin: "15px auto" }}
              onClick={handleUpdateName}
            >
              Update
            </button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default UpdateName;
