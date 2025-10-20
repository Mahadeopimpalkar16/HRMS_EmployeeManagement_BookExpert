// src/services/authService.ts
import axios from 'axios';

const API_BASE = 'https://localhost:7264/api/Auth';

export interface LoginPayload {
  username: string;
  passwordHash: string;
}

export interface RegisterPayload {
  username: string;
  passwordHash: string;
}

export interface LoginResponse {
  employeeId: number;
  name: string;
  role: string;
  access: 'read' | 'write';
}

export const login = async (payload: LoginPayload) => {
  const res = await axios.post<LoginResponse>(`${API_BASE}/login`, payload);
  return res.data;
};

export const register = async (payload: RegisterPayload) => {
  const res = await axios.post(`${API_BASE}/register`, payload);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('employeeId');
  localStorage.removeItem('access');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
};
