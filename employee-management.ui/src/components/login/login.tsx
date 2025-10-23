import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/auth.service";
import { Button, TextField } from "@mui/material";

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("employeeId")) {
      navigate("/");
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login handler
  const handleLogin = async () => {
    const { username, password } = form;

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const res = await login({ username, passwordHash: password });
      localStorage.setItem("employeeId", res.employeeId.toString());
      localStorage.setItem("username", res.username);
      localStorage.setItem("role", res.role);
      localStorage.setItem("access", res.access);
      navigate("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(message);
    }
  };

  // Register handler
  const handleRegister = async () => {
    const { username, password } = form;

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      await register({ username, passwordHash: password });
      setError("");
      setIsRegistering(false);
      alert("Registration successful! Please log in.");
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(message);
    }
  };

  // Submit handler (works for Enter key)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isRegistering ? handleRegister() : handleLogin();
  };

  return (
    <div className="dialog-container">
      <div className="dialog-box">
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />


          <TextField
            name="password"
            label="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Button type="submit">
            {isRegistering ? "Register" : "Login"}
          </Button>
        </form>

        <p className="switch-text">
          {isRegistering ? "Already registered?" : "Not registered yet?"}{" "}
          <span
            tabIndex={0}
            onClick={() => setIsRegistering(!isRegistering)}
            onKeyDown={(e) =>
              e.key === "Enter" && setIsRegistering(!isRegistering)
            }
          >
            {isRegistering ? "Login here" : "Register here"}
          </span>
        </p>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
