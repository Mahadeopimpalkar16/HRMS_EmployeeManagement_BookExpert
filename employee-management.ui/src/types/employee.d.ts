export interface Employee {
  id: number;
  name: string;
  departmentId: string;
  designationId: string;
  designation: string = "";
  dateOfJoin: string;
  salary: string;
  gender: string;
  state: string;
  dateOfBirth: string;
  email: string;
}
export interface CreateEmployee {
  id: number;
  name: string;
  departmentId: number;
  designationId: number;
  dateOfJoin: string;
  salary: string;
  gender: string;
  state: string;
  dateOfBirth: string;
  email: string;
}
export interface EmployeeFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (employee: CreateEmployee, editing: boolean) => void;
  employee: any | null;
  states: string[];
}
