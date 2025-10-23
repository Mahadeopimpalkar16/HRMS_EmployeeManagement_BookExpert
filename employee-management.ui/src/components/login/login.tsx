import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../services/auth.service";
import { Button, TextField, Typography } from "@mui/material";

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("employeeId")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login handler
  const handleLogin = async () => {
    const { username, password } = form;

    if (!username || !password) {
      setMessage("Please enter both username and password");
      setIsError(true);
      return;
    }

    try {
      const res = await login({ username, passwordHash: password });

      // ✅ Show API success response
      setMessage("✅ Login successful!");
      setIsError(false);

      localStorage.setItem("employeeId", res.employeeId?.toString() || "");
      localStorage.setItem("username", res.username || "");
      localStorage.setItem("role", res.role || "");
      localStorage.setItem("access", res.access || "");

      // navigate after short delay so user sees message
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      // ✅ Show only API message like "Invalid credentials"
      const apiMessage =
        err?.response?.data?.message || // if API uses "message"
        err?.response?.data?.error || // if API uses "error"
        err?.response?.data || // if plain text
        "Something went wrong";

      setMessage(apiMessage);
      setIsError(true);
    }
  };

  // Register handler
  const handleRegister = async () => {
    const { username, password } = form;

    if (!username || !password) {
      setMessage("Please fill all fields");
      setIsError(true);
      return;
    }

    try {
      const res = await register({ username, passwordHash: password });
      setMessage("✅ Registration successful! Please log in.");
      setIsError(false);
      setIsRegistering(false);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        "Something went wrong";

      setMessage(apiMessage);
      setIsError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
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
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
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
        {message && (
          <Typography
            variant="body2"
            color="error"
            sx={{
              mt: 1,
              textAlign: "center",
              whiteSpace: "pre-line", // keeps multi-line spacing
              lineHeight: 1.5,        // adds vertical spacing
            }}
          >
            {message}
          </Typography>
        )}

      </div>
    </div>
  );
};

export default Login;
