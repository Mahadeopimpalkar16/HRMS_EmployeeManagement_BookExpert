import axios from "axios";
import { type AttendanceSummary, type DailyAttendance } from "../components/attendance/types";

const API_BASE = "https://localhost:7264/api/Attendance";

export const AttendanceService = {
  checkIn: (employeeId: number) =>
    axios.post(`${API_BASE}/checkin?employeeId=${employeeId}`),

  checkOut: (employeeId: number) =>
    axios.post(`${API_BASE}/checkout?employeeId=${employeeId}`),

  getTodayStatus: (employeeId: number) =>
    axios.get(`${API_BASE}/today?employeeId=${employeeId}`),

  getWeeklySummary: (employeeId: number, weekOffset: number = 0) =>
    axios.get<DailyAttendance[]>(`${API_BASE}/weekly-summary`, {
      params: { employeeId, weekOffset },
    }),

  getMonthlySummary: (employeeId: number) =>
    axios.get<DailyAttendance[]>(`${API_BASE}/monthly-summary`, {
      params: { employeeId },
    }),
  fetchAttendanceList: () =>
    axios.get<AttendanceSummary[]>(`${API_BASE}/attendance-list`),

  getReport: (employeeId: number, from: string, to: string) =>
    axios.get(`${API_BASE}/report?employeeId=${employeeId}&from=${from}&to=${to}`),
};
