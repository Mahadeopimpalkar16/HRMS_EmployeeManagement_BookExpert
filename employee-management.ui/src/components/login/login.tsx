import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/auth.service';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('employeeId')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const res = await login({ username, passwordHash: password });
      console.log(res);
      localStorage.setItem('employeeId', res.employeeId.toString());
      localStorage.setItem('username', res.username);
      localStorage.setItem('role', res.role);
      localStorage.setItem('access', res.access);

      console.log("employeeId : " + localStorage.getItem('employeeId'))
      console.log("username : " + localStorage.getItem('username'))
      console.log("role : " + localStorage.getItem('role'))
      console.log("access : " + localStorage.getItem('access'))

      navigate('/');
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err?.message || 'Something went wrong';
      setError(message);
      console.log(message);
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
      const message =
        err?.response?.data?.error || err?.message || 'Something went wrong';
      setError(message);
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
