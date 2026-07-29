import React, { useState } from "react";
import { Form, Input, message, Upload, Button } from "antd";
import "../resources/global.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";

function Register() {
  const validateRegister = (_, value) => {
    // Validate the email using a regular expression
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.]+(?:\.[a-zA-Z]{2,})+$/;
    const isValid = emailRegex.test(value);

    if (!isValid) {
      return Promise.reject("Please enter a valid email");
    }

    // Extract the domain part after @ symbol
    const [, domain] = value.split("@");

    // Check if there are only 2 or 3 characters after the first dot in the domain
    const domainRegex = /^[^.]+\.([^.]{2,3})$/;
    const isCorrectFormat = domainRegex.test(domain);

    if (!isCorrectFormat) {
      return Promise.reject("Invalid email format");
    }

    return Promise.resolve();
  };

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);

      // Check if profile image is provided before appending to formData
      if (values.profileImage && values.profileImage.file) {
        formData.append("profileImage", values.profileImage.file);
      }

      const response = await axios.post("/api/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
        // Server responded with an error
        message.error(error.response.data.message);
      } else if (error.request) {
        // Request sent but no response received
        message.error("Server is not responding");
      } else {
        // Something else happened
        message.error(error.message);
      }
    }
  };

  const handleFileChange = (info) => {
    setFileList(info.fileList);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card w-400 p-4">
        <h1 className="text-xl text-center">Register</h1>
        <hr />
        <div className="p-3">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { whitespace: true },
                { min: 4 },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { validator: validateRegister },
              ]}
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 4, message: "Password must be at least 4 characters" },
              ]}
              hasFeedback
            >
              <Input.Password type="password" autoComplete="off" />
            </Form.Item>
            <Form.Item label="Profile Image" name="profileImage">
              <Upload
                name="profileImage"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                preserve={true}
                maxCount={1}
              >
                <Button>Upload image</Button>
              </Upload>
            </Form.Item>
            {/* {fileList.length > 0 && (
              <div>
                <p>Selected File:</p>
                <p>{fileList[0].name}</p>
              </div>
            )} */}
            <div className="flex justify-between items-center flex-col">
              <Link className="pb-4" to="/login">
                Click here to Login
              </Link>
              <button type="submit" className="secondary">
                Register
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
