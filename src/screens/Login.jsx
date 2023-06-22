import { Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        
        navigate("/")
      })
      .catch((error) => {
        console.log(error)
        messageApi.open({
          type: 'error',
          content: "Incorrect credentials",
        });
      });
  };

  return (
    <div className="login-container">
      {contextHolder}
      <img src="/images/logo.jpg" alt="logo" />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: "Please input a valid Email!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="http://localhost:3000/login">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
