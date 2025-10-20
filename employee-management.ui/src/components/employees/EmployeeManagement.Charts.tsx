import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import type{ Employee } from "../../types/employee";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28CFF", "#FF6F91", "#FFB6B9", "#B5EAD7",
];

interface Props {
  employees: Employee[];
  type?: "pie" | "bar" | "line";
}

const EmployeeChart: React.FC<Props> = ({ employees, type = "pie" }) => {
  const data = Object.values(
    employees.reduce((acc, emp) => {
      if (!acc[emp.designation]) {
        acc[emp.designation] = { designation: emp.designation, salary: 0 };
      }
      acc[emp.designation].salary += Number(emp.salary) || 0;
      return acc;
    }, {} as Record<string, { designation: string; salary: number }>)
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === "pie" && (
        <PieChart>
          <Pie
            data={data}
            dataKey="salary"
            nameKey="designation"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
      {type === "bar" && (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          <XAxis dataKey="designation" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="salary" fill="#8884d8" />
        </BarChart>
      )}
      {type === "line" && (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          <XAxis dataKey="designation" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="salary" stroke="#82ca9d" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default EmployeeChart;
