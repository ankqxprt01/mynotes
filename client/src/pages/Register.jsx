import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  message,
  Upload,
  Button,
  Card,
  Typography,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { axiosInstance } from "../helpers/axiosInstance";

const { Title } = Typography;

function Register() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const validateRegister = (_, value) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.]+(?:\.[a-zA-Z]{2,})+$/;

    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email");
    }

    const [, domain] = value.split("@");

    const domainRegex = /^[^.]+\.([^.]{2,3})$/;

    if (!domainRegex.test(domain)) {
      return Promise.reject("Invalid email format");
    }

    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("favFood", values.favFood);

      if (values.profileImage?.file) {
        formData.append("profileImage", values.profileImage.file);
      }

      const response = await axiosInstance.post(
        "/api/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(HideLoading());

      if (response.data.success) {
        form.resetFields();
        setFileList([]);
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());

      if (error.response) {
        message.error(error.response.data.message);
      } else if (error.request) {
        message.error("Server is not responding");
      } else {
        message.error(error.message);
      }
    }
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  useEffect(() => {
    document.title = "Register";
  }, []);

  return (
    <div className="register-container">
      <Card className="register-card">
        <Title level={3} style={{ textAlign: "center" }}>
          Register
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { whitespace: true },
              { min: 4, message: "Minimum 4 characters" },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { validator: validateRegister },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                min: 4,
                message: "Password must be at least 4 characters",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            label="Favourite Food"
            name="favFood"
            rules={[
              {
                required: true,
                message: "Please enter your favourite food",
              },
            ]}
          >
            <Input placeholder="Example: Pizza" />
          </Form.Item>

          <Form.Item label="Profile Image" name="profileImage">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button>Choose Image</Button>
            </Upload>
          </Form.Item>

          <div className="register-link">
            <Link to="/login">Already have an account? Login</Link>
          </div>

          <Space orientation="vertical" style={{ width: "100%" }}>
            <Button type="primary" htmlType="submit" block size="large">
              Register
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
