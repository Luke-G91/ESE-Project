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

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    onSuccess: () => {
      navigate("/home");
      refetch();
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
      {mutation.isError && <p style={{ color: "red" }}>Login failed</p>}
      <p>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
