import axios from "axios";
import type { Department } from "../types/department";

const apiBase = "https://localhost:7264/api/Department";

export const fetchDepartments = async (): Promise<Department[]> => {
  const res = await axios.get(`${apiBase}/GetDepartments`);
  return res.data.departments || res.data;
};

export const GetDepartmentsById = async (departmentId: number): Promise<Department> => {
  const res = await axios.get(`${apiBase}/GetDepartment/${departmentId}`);
  return res.data.designations || res.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/DeleteDepartment/${id}`);
};

export const addDepartment = async (dept: Department): Promise<void> => {
  await axios.post(`${apiBase}/CreateDepartment`, dept);
};

export const updateDepartment = async (dept: Department): Promise<void> => {
  await axios.put(`${apiBase}/UpdateDepartment/${dept.deptId}`, dept);
};