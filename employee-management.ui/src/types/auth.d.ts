export interface LoginPayload {
  username: string;
  passwordHash: string;
}

export interface LoginResponse {
  employeeId: number;
  username: string;
  role: string;
  access: 'read' | 'write';
}