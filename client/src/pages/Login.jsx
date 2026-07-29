import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, message, Card, Typography, Button, Space } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [enteredEmail, setEnteredEmail] = useState("");

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.]+(?:\.[a-zA-Z]{2,})+$/;

    if (!emailRegex.test(value)) {
      return Promise.reject("Please check email field");
    }

    const [, domain] = value.split("@");

    const domainRegex = /^[^.]+\.([^.]{2,3})$/;

    if (!domainRegex.test(domain)) {
      return Promise.reject("Invalid email format");
    }

    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if (!value || value.length < 4) {
      return Promise.reject("Password must be at least 4 characters");
    }

    return Promise.resolve();
  };

  const handleNext = async () => {
    if (step === 1) {
      try {
        await validateEmail(null, formData.email);
        setStep(2);
      } catch (error) {
        message.error(error);
      }
    } else {
      try {
        await validatePassword(null, formData.password);

        dispatch(ShowLoading());

        const response = await axiosInstance.post("/api/users/login", formData);

        dispatch(HideLoading());

        if (response.data.success) {
          message.success(`Welcome, ${formData.email}!`);

          localStorage.setItem("token", response.data.data);
          window.location.href = "/";
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());

        if (error.response?.data?.message) {
          message.error(error.response.data.message);
        } else {
          message.error("Something went wrong!");
        }
      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (changedValues) => {
    setFormData((prev) => ({
      ...prev,
      ...changedValues,
    }));

    if (changedValues.email) {
      setEnteredEmail(changedValues.email);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} style={{ textAlign: "center" }}>
          Login
        </Title>

        <Form layout="vertical" onValuesChange={handleChange}>
          {step === 1 && (
            <>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter email",
                  },
                  {
                    validator: validateEmail,
                  },
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <div className="center">
                <Link to="/register">Create New Account</Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Text className="welcome-text">Welcome {enteredEmail}</Text>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter password",
                  },
                  {
                    validator: validatePassword,
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter password"
                  autoComplete="off"
                />
              </Form.Item>

              <div className="center">
                <Link to="/reset-password">Forgot Password?</Link>
              </div>
            </>
          )}

          <Space
            orientation="vertical"
            style={{
              width: "100%",
              marginTop: 20,
            }}
            align="center"
          >
            {step === 2 && (
              <LeftCircleOutlined
                style={{
                  fontSize: 28,
                  cursor: "pointer",
                }}
                onClick={handleBack}
              />
            )}

            <Button type="primary" block onClick={handleNext}>
              {step === 1 ? "Next" : "Login"}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
