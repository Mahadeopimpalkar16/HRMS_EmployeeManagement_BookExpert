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
import type { CreateEmployee, EmployeeFormProps } from "../../types/employee";
import {
  fetchDepartments,
  fetchDesignationsByDepartment,
} from "../../services/employeeService";

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Designation {
  designationId: number;
  title: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  show,
  onHide,
  onSubmit,
  employee,
  states,
}) => {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    departmentId: 0,
    designationId: 0,
    dateOfJoin: "",
    salary: "",
    gender: "",
    state: "",
    dateOfBirth: "",
    email: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReadOnly, setIsReadOnly] = useState(false);

  // 🧩 Check access rights
  useEffect(() => {
    const access = localStorage.getItem("access");
    setIsReadOnly(access !== "write");
  }, []);

  // 🔹 Fetch departments initially
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await fetchDepartments();
        setDepartments(res);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };
    loadDepartments();
  }, []);

  // 🔹 Fetch designations whenever department changes
  useEffect(() => {
    const loadDesignations = async () => {
      if (!form.departmentId) {
        setDesignations([]);
        return;
      }
      try {
        const res = await fetchDesignationsByDepartment(Number(form.departmentId));
        setDesignations(res);
      } catch (err) {
        console.error("Failed to load designations", err);
      }
    };
    loadDesignations();
  }, [form.departmentId]);

  // 🔹 Load employee data if editing
useEffect(() => {
  if (employee) {
    setForm({
      id: employee.id,
      name: employee.name,
      departmentId: employee.departmentId,
      designationId: employee.designationId,
      dateOfJoin: employee.dateOfJoin || "",
      salary: employee.salary?.toString() || "",
      gender: employee.gender || "",
      state: employee.state || "",
      dateOfBirth: employee.dateOfBirth || "",
      email: employee.email || "",
    });
    if (employee.dateOfBirth) calculateAge(employee.dateOfBirth);
  } else {
    handleClear();
  }
}, [employee, show]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "dateOfBirth") calculateAge(value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) age--;
    setAge(age.toString());
  };

  const handleClear = () => {
    setForm({
      id: 0,
      name: "",
      departmentId: 0,
      designationId: 0,
      dateOfJoin: "",
      salary: "",
      gender: "",
      state: "",
      dateOfBirth: "",
      email: "",
    });
    setAge("");
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.departmentId) newErrors.departmentId = "Department is required.";
    if (!form.designationId) newErrors.designationId = "Designation is required.";
    if (!form.dateOfJoin) newErrors.dateOfJoin = "Date of Join is required.";
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0)
      newErrors.salary = "Salary must be greater than 0.";
    if (!form.gender) newErrors.gender = "Gender is required.";
    if (!form.state) newErrors.state = "State is required.";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!form.email) newErrors.email = "Email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = () => {
  if (!validate()) return;
  onSubmit(
    form, !!employee
  );
};



  return (
    <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>{employee ? "Edit" : "Add"} Employee</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            InputProps={{ readOnly: isReadOnly }}
          />

          <TextField
            select
            label="Department"
            name="departmentId"
            fullWidth
            value={form.departmentId}
            onChange={handleChange}
            error={!!errors.departmentId}
            helperText={errors.departmentId}
            required
            disabled={isReadOnly}
          >
            <MenuItem value="">-- Select Department --</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Designation"
            name="designationId"
            fullWidth
            value={form.designationId}
            onChange={handleChange}
            error={!!errors.designationId}
            helperText={errors.designationId}
            required
            disabled={isReadOnly}
          >
            <MenuItem value="">-- Select Designation --</MenuItem>
            {designations.map((d) => (
              <MenuItem key={d.designationId} value={d.designationId}>
                {d.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date of Join"
            name="dateOfJoin"
            type="date"
            fullWidth
            value={form.dateOfJoin?.substring(0, 10)}
            onChange={handleChange}
            error={!!errors.dateOfJoin}
            helperText={errors.dateOfJoin}
            InputLabelProps={{ shrink: true }}
            required
            InputProps={{ readOnly: isReadOnly }}
          />

          <TextField
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            value={form.salary}
            onChange={handleChange}
            error={!!errors.salary}
            helperText={errors.salary}
            required
            InputProps={{ readOnly: isReadOnly }}
          />

          <FormControl component="fieldset" error={!!errors.gender}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" disabled={isReadOnly} />
              <FormControlLabel value="Female" control={<Radio />} label="Female" disabled={isReadOnly} />
            </RadioGroup>
            {errors.gender && <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.gender}</div>}
          </FormControl>

          <TextField
            select
            label="State"
            name="state"
            fullWidth
            value={form.state}
            onChange={handleChange}
            error={!!errors.state}
            helperText={errors.state}
            required
            disabled={isReadOnly}
          >
            <MenuItem value="">Select State</MenuItem>
            {states.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            value={form.dateOfBirth?.substring(0, 10)}
            onChange={handleChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: isReadOnly }}
            required
          />

          <TextField label="Age" value={age} fullWidth disabled />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{ readOnly: isReadOnly }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onHide} color="primary">
          Cancel
        </Button>
        {!isReadOnly && (
          <>
            <Button onClick={handleClear} color="warning">
              Clear
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {employee ? "Update" : "Save"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
