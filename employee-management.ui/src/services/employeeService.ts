import axios from "axios";
import type{ CreateEmployee, Employee } from "../types/employee";

const apiBase = "https://localhost:7264/api/Employee";

// 🧾 Employee CRUD
export const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await axios.get(`${apiBase}/GetAllEmployees`);
  return res.data.employees || res.data;
};

export const fetchStates = async (): Promise<string[]> => {
  const res = await axios.get(`${apiBase}/GetAllStates`);
  return (res.data.states || res.data).map((s: { stateName: string }) => s.stateName);
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${apiBase}/DeleteEmployee/${id}`);
};

export const deleteMultipleEmployees = async (ids: number[]): Promise<void> => {
  await axios.delete(`${apiBase}/DeleteMultiple`, { data: ids });
};

export const addEmployee = async (employee: CreateEmployee): Promise<void> => {
  await axios.post(`${apiBase}/AddEmployee`, employee);
};

export const updateEmployee = async (employee: Employee): Promise<void> => {
  await axios.put(`${apiBase}/UpdateEmployee/${employee.id}`, employee);
};

export const fetchDepartments = async (): Promise<{ departmentId: number; departmentName: string }[]> => {
  const res = await axios.get(`${apiBase}/GetDepartments`);
  return res.data.departments || res.data;
};

export const fetchDesignationsByDepartment = async (departmentId: number): Promise<{ designationId: number; title: string }[]> => {
  const res = await axios.get(`${apiBase}/GetDesignationsByDepartment/${departmentId}`);
  return res.data.designations || res.data;
};