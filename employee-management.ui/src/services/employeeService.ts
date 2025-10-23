import axios from "axios";
import type { Employee } from "../types/employee";

const apiBase = "https://localhost:7264/api/Employees";

// 🧾 Employee CRUD
export const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await axios.get(`${apiBase}/GetAllEmployees`);
  return res.data || res.data;
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

export const addEmployee = async (employee: Employee): Promise<void> => {
  await axios.post(`${apiBase}/CreateEmployee`, employee);
};

export const updateEmployee = async (employee: Employee): Promise<void> => {
  await axios.put(`${apiBase}/UpdateEmployee/${employee.id}`, employee);
};

export const getEmployeeByEmail = async (email: string): Promise<Employee | null> => {
  try {
    const res = await axios.get(`${apiBase}/GetEmployeeByEmail/${email}`)
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    if(axios.isAxiosError(err)){
      if(err.response?.status == 404){
        console.warn("Email not found.", email);
      }
      else{
        console.error("API error : ", err.response?.data || err.message);
      }
    }else{
      console.error("Unexpected error:", err);
    }
    return null;
  }

}

