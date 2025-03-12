import "./Login.css";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refetch } = useAuth();

  const { mutate: loginUser, isError: isLoginError } = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    onSuccess: () => {
      navigate("/home");
      refetch();
    },
  });

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">Login</h1>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {isLoginError && <p className="login-error">Invalid email or password</p>}
      <p className="login-register">
        Don't have an account?{" "}
        <span onClick={() => navigate("/register")}>Register here</span>
      </p>
    </div>
  );
};

export default Login;
