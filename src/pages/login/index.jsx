import "./login.css";
import { Button, Col, Form, Image, Input, Row } from "antd";
import Colors from "../../utils/Colors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useState } from "react";
const { setUser } = require("../../redux/reduxsauce/authRedux");

const LOGO = require("../../Images/logotext.png");
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const fetchdata = (values) => {
    setIsLoading(true);
    const params = {
      uniqueId: values?.username || "",
      password: values?.password || "",
    };
    try {
      axios
        .post("/admin/login", params)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            dispatch(setUser(response?.data?.data));
            toast.success("Login Sucessfully");
            navigate("/dashboard");
          } else {
            setIsLoading(false);
            const errorMessage = response?.data?.message;
            toast.error(errorMessage);
          }
        })
        .catch((error) => {
          if (error) {
            if (error.response) {
              setIsLoading(false);
              const errorMessage =
                error.response.data?.message || "Server Error";
              toast.error(errorMessage);
            } else if (error.request) {
              setIsLoading(false);
              toast.error("No response from server");
            } else {
              setIsLoading(false);
              toast.error("Error");
            }
          }
        });
    } catch (error) {
      toast.error("uniqueId is not allowed to be empty");
    }
  };
  const onFinish = (values) => {
    fetchdata(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Please input field");
  };

  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <Row justify="center" align="middle" className="mb-4">
        <Col>
          <Image preview={false} width={150} src={LOGO} />
        </Col>
      </Row>
      <Row justify="center" align="middle">
        <Col lg={8} className="align-items-center">
          <h1
            className="heading text-center fw-bold color"
            style={{ color: "#a62239" }}
          >
            Login
          </h1>
          <p
            className="text-center mb-4"
            style={{
              color: Colors.theme_color,
              fontSize: "17px",
            }}
          >
            Please enter your login and password
          </p>
          <div style={{ justifyContent: "center" }}>
            <Form
              name="basic"
              style={{
                maxWidth: 500,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input
                  className="p-2 input "
                  placeholder="Enter your username"
                  prefix={
                    <UserOutlined
                      style={{
                        fontSize: 22,
                        color: "#a62239",
                        marginRight: "10px",
                      }}
                    />
                  }
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  className="p-2 input"
                  placeholder="Enter your password"
                  prefix={
                    <LockOutlined
                      style={{
                        fontSize: 22,
                        color: "#a62239",
                        marginRight: "10px",
                      }}
                    />
                  }
                />
              </Form.Item>
              <div style={{ textAlign: "right" }}>
                <Link
                  className="text-decoration-none"
                  style={{ color: "#a62239" }}
                >
                  Forget Password?
                </Link>
              </div>
              <Form.Item className="d-flex justify-content-center">
                <Button
                  size="large"
                  htmlType="submit"
                  className="login-btn"
                  loading={isLoading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
