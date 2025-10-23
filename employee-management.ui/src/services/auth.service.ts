// src/services/authService.ts
import axios from 'axios';
import type { LoginPayload, LoginResponse } from '../types/auth';

const API_BASE = 'https://localhost:7264/api/Auth';

export const login = async (payload: LoginPayload) => {
  const res = await axios.post<LoginResponse>(`${API_BASE}/login`, payload);
  console.log(res.data);
  return res.data;
};

export const register = async (payload: LoginPayload) => {
  const res = await axios.post(`${API_BASE}/register`, payload);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('employeeId');
  localStorage.removeItem('access');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
};
