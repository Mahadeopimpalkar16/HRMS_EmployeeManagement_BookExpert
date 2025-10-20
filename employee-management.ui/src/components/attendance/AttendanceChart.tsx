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
import type { AttendanceSummary } from "./types";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28CFF", "#FF6F91", "#FFB6B9", "#B5EAD7",
];

interface Props {
  data: AttendanceSummary[];
  type?: "pie" | "bar" | "line";
  category?: "status" | "department";
}

const AttendanceChart: React.FC<Props> = ({
  data,
  type = "pie",
  category = "status",
}) => {
  // Group by either "dayStatus" or "department"
  const groupedData = Object.values(
    data.reduce((acc, att) => {
      const key = category === "status" ? att.dayStatus : att.department;
      if (!acc[key]) {
        acc[key] = { name: key, count: 0 };
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { name: string; count: number }>)
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      {type === "pie" && (
        <PieChart>
          <Pie
            data={groupedData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {groupedData.map((entry, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      {type === "bar" && (
        <BarChart
          data={groupedData}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      )}

      {type === "line" && (
        <LineChart
          data={groupedData}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
