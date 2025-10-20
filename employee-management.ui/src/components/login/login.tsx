import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/auth.service';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const res = await login({ username, passwordHash: password });
      localStorage.setItem('employeeId', res.employeeId.toString());
      localStorage.setItem('access', res.access);
      localStorage.setItem('role', res.role);
      localStorage.setItem('name', res.name);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Invalid credentials' : 'Login failed');
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      await register({ username, passwordHash: password });
      setError('');
      setIsRegistering(false);
      alert('Registration successful. Please log in.');
    } catch (err: any) {
      setError('Registration failed');
    }
  };

  return (
    <div className="dialog-container">
      <div className="dialog-box">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p className="switch-text">
          {isRegistering ? 'Already registered?' : 'Not registered yet?'}{' '}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
