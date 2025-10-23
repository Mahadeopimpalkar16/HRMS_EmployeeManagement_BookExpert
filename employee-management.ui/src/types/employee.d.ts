import type { Department, Designation } from "./department";


export interface Employee {
  id: number;
  name: string;
  salary: number;
  gender: string;
  state: string;
  dateOfBirth: string;
  dateOfJoin: string;
  email: string;

  deptId: number;
  department: Department; // ✅ object

  designationId: number;
  designation: Designation; // ✅ object
}

export interface CreateEmployee {
  id: number;
  name: string;
  deptId: number;
  designationId: number;
  dateOfJoin: string;
  salary: number;
  gender: string;
  state: string;
  dateOfBirth: string;
  email: string;
}
export interface EmployeeFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (employee: CreateEmployee, editing: boolean) => void;
  employee: Employee | null;
  states: string[];
}
