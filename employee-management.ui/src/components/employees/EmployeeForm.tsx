import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  Box,
} from "@mui/material";
import type { EmployeeFormProps } from "../../types/employee";
import type { Department, Designation } from "../../types/department";
import { fetchDepartments } from "../../services/departmentService";
import { getEmployeeByEmail } from "../../services/employeeService";


const EmployeeForm: React.FC<EmployeeFormProps> = ({ show, onHide, onSubmit, employee, states }) => {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    salary: "",
    gender: "",
    state: "",
    dateOfBirth: "",
    dateOfJoin: "",
    email: "",
    deptId: '',
    designationId: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEmailExists, setIsEmailExists] = useState(false);

  // Check access rights
  useEffect(() => {
    const access = localStorage.getItem("access");
    setIsReadOnly(access !== "write");
  }, []);

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetchDepartments(); // returns [{deptId, departmentName}]
        setDepartments(res);
      } catch (err) {
        console.error(err);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (!form.deptId) {
      setDesignations([]);
      return;
    }
    try {

      const selectedDept = departments.find(d => d.deptId == Number(form.deptId));
      setDesignations(selectedDept?.designations || []);
    } catch (err) {
      console.error(err);
    }
  }, [form.deptId, departments]);

  // Load employee data if editing
  useEffect(() => {
    if (employee) {
      setForm({
        id: employee.id,
        name: employee.name || "",
        salary: employee.salary?.toString() || "",
        gender: employee.gender || "",
        state: employee.state || "",
        dateOfBirth: employee.dateOfBirth?.substring(0, 10) || "",
        dateOfJoin: employee.dateOfJoin?.substring(0, 10) || "",
        email: employee.email || "",
        deptId: employee.deptId.toString() || "",
        designationId: employee.designationId.toString() || "",
      });
      if (employee.dateOfBirth) calculateAge(employee.dateOfBirth);
    } else {
      handleClear();
    }
  }, [employee, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "dateOfBirth") calculateAge(value);
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    let ageCalc = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const d = today.getDate() - birth.getDate();
    if (m < 0 || (m === 0 && d < 0)) ageCalc--;
    setAge(ageCalc.toString());
  };

  const handleClear = () => {
    setForm({
      id: 0,
      name: "",
      salary: "",
      gender: "",
      state: "",
      dateOfBirth: "",
      dateOfJoin: "",
      email: "",
      deptId: "",
      designationId: "",
    });
    setErrors({});
    setAge("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.deptId) newErrors.deptId = "Department is required.";
    if (!form.designationId) newErrors.designationId = "Designation is required.";
    if (!form.dateOfJoin) newErrors.dateOfJoin = "Date of Join is required.";
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0)
      newErrors.salary = "Salary must be greater than 0.";
    if (!form.gender) newErrors.gender = "Gender is required.";
    if (!form.state) newErrors.state = "State is required.";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if(isEmailExists) newErrors.email = "Email already exists."
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const existingEmployee = await getEmployeeByEmail(form.email);

    if (existingEmployee && existingEmployee.id !== form.id) {
      setErrors(prev => ({ ...prev, email: "Email already exists." }));
      return;
    }
    onSubmit({
      id: form.id,
      name: form.name,
      salary: Number(form.salary),
      gender: form.gender,
      state: form.state,
      dateOfBirth: form.dateOfBirth,
      dateOfJoin: form.dateOfJoin,
      email: form.email,
      deptId: Number(form.deptId),
      designationId: Number(form.designationId),
    }, !!employee);
  };

  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>{employee ? "Edit" : "Add"} Employee</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required InputProps={{ readOnly: isReadOnly }} />
          <TextField select label="Department" name="deptId" fullWidth value={form.deptId} onChange={handleChange} error={!!errors.deptId} helperText={errors.deptId} required disabled={isReadOnly}>
            <MenuItem value="">-- Select Department --</MenuItem>
            {departments.map(d => <MenuItem key={d.deptId} value={d.deptId}>{d.deptName}</MenuItem>)}
          </TextField>
          <TextField select label="Designation" name="designationId" fullWidth value={form.designationId} onChange={handleChange} error={!!errors.designationId} helperText={errors.designationId} required disabled={isReadOnly}>
            <MenuItem value="">-- Select Designation --</MenuItem>
            {designations.map(d => <MenuItem key={d.designationId} value={d.designationId}>{d.designationName}</MenuItem>)}
          </TextField>
          <TextField label="Date of Join" name="dateOfJoin" type="date" fullWidth value={form.dateOfJoin} onChange={handleChange} error={!!errors.dateOfJoin} helperText={errors.dateOfJoin} InputLabelProps={{ shrink: true }} required InputProps={{ readOnly: isReadOnly }} />
          <TextField label="Salary" name="salary" type="number" fullWidth value={form.salary} onChange={handleChange} error={!!errors.salary} helperText={errors.salary} required InputProps={{ readOnly: isReadOnly }} />
          <FormControl component="fieldset" error={!!errors.gender}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
              <FormControlLabel value="Male" control={<Radio />} label="Male" disabled={isReadOnly} />
              <FormControlLabel value="Female" control={<Radio />} label="Female" disabled={isReadOnly} />
            </RadioGroup>
            {errors.gender && <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.gender}</div>}
          </FormControl>
          <TextField select label="State" name="state" fullWidth value={form.state} onChange={handleChange} error={!!errors.state} helperText={errors.state} required disabled={isReadOnly}>
            <MenuItem value="">Select State</MenuItem>
            {states.map((s: string) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Date of Birth" name="dateOfBirth" type="date" fullWidth value={form.dateOfBirth} onChange={handleChange} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: isReadOnly }} required />
          <TextField label="Age" value={age} fullWidth disabled />
          <TextField label="Email" name="email" fullWidth value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required InputProps={{ readOnly: isReadOnly }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide}>Cancel</Button>
        {!isReadOnly && <>
          <Button onClick={handleClear} color="warning">Clear</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">{employee ? "Update" : "Save"}</Button>
        </>}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
