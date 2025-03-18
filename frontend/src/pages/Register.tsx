import "./Register.css";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const { mutate: registerUser, isError: isRegisterError } = useMutation({
    mutationFn: (data: { email: string; name: string; password: string }) =>
      register(data),
    onSuccess: () => {
      toast.success("User registered successfully");
      navigate("/login");
    },
  });

  // prevent default to stop form submissions from sending default form requests
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      registerUser({ email, name, password });
    }
  };

  const validatePassword = () => {
    const errors: string[] = [];
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
      errors.push("Password must contain at least one lowercase letter");
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      errors.push("Password must contain at least one uppercase letter");
    }

    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
      errors.push("Password must contain at least one number");
    }

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
      errors.push("Password must contain at least one special character");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="register-title">Register</h1>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      {passwordErrors.map((error, index) => (
        <p key={index} className="register-error">
          {error}
        </p>
      ))}
      {isRegisterError && <p className="register-error">Registration failed</p>}
      <p className="login-register">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login here</span>
      </p>
    </div>
  );
};

export default Register;
