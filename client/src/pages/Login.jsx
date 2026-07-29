import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [enteredEmail, setEnteredEmail] = useState(""); // New state for entered email

  const validateEmail = (_, value) => {
    // Validate the email using a regular expression
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.]+(?:\.[a-zA-Z]{2,})+$/;
    const isValid = emailRegex.test(value);

    if (!isValid) {
      return Promise.reject("Please check email field");
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

  const validatePassword = (_, value) => {
    if (!value || value.length < 4) {
      return Promise.reject("Password must be at least 4 characters");
    }

    return Promise.resolve();
  };

  // const validatePassword = (_, value) => {
  //   // Define your regex pattern for password validation
  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+[0-9a-zA-Z@]{4,}$/;

  //   if (!value || passwordRegex.test(value)) {
  //     return Promise.resolve();
  //   }

  //   return Promise.reject('Password must contain at least 4 characters, including one letter and one number.');
  // };

  const handleNext = async () => {
    if (step === 1) {
      // Validate email before proceeding to the next step
      try {
        await validateEmail(null, formData.email);
        setStep(2);
      } catch (error) {
        message.error(error);
      }
    } else if (step === 2) {
      // Validate password and submit the form
      try {
        await validatePassword(null, formData.password);
        dispatch(ShowLoading());

        // Assuming the server sends user information upon successful login
        const response = await axiosInstance.post("/api/users/login", formData);
        dispatch(HideLoading());

        if (response.data.success) {
          // Display the email address after the user enters the password
          message.success(`Welcome, ${formData.email}!`);

          localStorage.setItem("token", response.data.data);
          window.location.href = "/";
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());

        // Check if 'error' exists and has a 'message' property before accessing it
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.error(error.response.data.message);
        } else {
          // Handle the case when 'error' or 'message' property is undefined
          message.error("Something went wrong!");
        }
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleChange = (changedValues) => {
    setFormData((prevData) => ({ ...prevData, ...changedValues }));
    // Update entered email when the email field changes
    if (changedValues.email) {
      setEnteredEmail(changedValues.email);
    }
  };

  return (
    <div className="h-screen">
      <div className="card w-400 p-4">
        <h1 className="text-xl text-center">Login</h1>
        <hr />
        <div className="p-3">
          <Form
            layout="vertical"
            onFinish={() => {}}
            onValuesChange={handleChange}
          >
            {step === 1 && (
              <>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "",
                    },
                    { validator: validateEmail },
                  ]}
                  hasFeedback
                >
                  <Input />
                </Form.Item>
                <Link to="/register" className="flex justify-center mb-2">
                  Click here to Register
                </Link>
              </>
            )}
            {step === 2 && (
              <>
                {/* Display entered email */}
                <p className="mb-2 p-5 text-center">Welcome {enteredEmail}</p>
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
                      message: "",
                    },
                    { validator: validatePassword },
                  ]}
                  hasFeedback
                >
                  <Input.Password type="password" autoComplete="off" />
                </Form.Item>
                <Link to="/reset-password" className="flex justify-center mb-2">
                  Forget Password
                </Link>
              </>
            )}

            <div className="flex justify-between items-center flex-col">
              {step === 2 && (
                <i
                  style={{ fontSize: "2rem", cursor: "pointer", color: "gray" }}
                  className="bx bx-left-arrow-circle"
                  onClick={handleBack}
                ></i>
              )}
              <button
                type="button"
                className="secondary mt-3"
                onClick={handleNext}
              >
                {step === 1 ? "Next" : "Login"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
