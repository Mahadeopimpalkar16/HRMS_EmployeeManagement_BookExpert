export interface AttendanceSummary {
  employeeId: number;
  name: string;
  designation: string;
  department: string;
  dayStatus: string;
  weeklyPercent: number;
}

export interface DailyAttendance {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  totalTime: string;
  percent: number;
}
