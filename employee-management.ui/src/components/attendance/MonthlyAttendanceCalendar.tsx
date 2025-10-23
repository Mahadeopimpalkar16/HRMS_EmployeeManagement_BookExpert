import React from "react";
import { Box, Tooltip, Typography, Paper } from "@mui/material";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import type { DailyAttendance } from "../../types/attendance";

interface Props {
  data: DailyAttendance[];
}

const MonthlyAttendanceCalendar: React.FC<Props> = ({ data }) => {
  const monthDays = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const getStatusColor = (record?: DailyAttendance) => {
    if (!record) return "#ccc"; // no data
    const [h, m] = record.totalTime.split(":").map(Number);
    const totalHours = h + m / 60;

    if (totalHours >= 5) return "#4CAF50"; // green
    if (totalHours > 0) return "#FFC107"; // yellow
    return "#F44336"; // red
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
      {/* Weekday headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <Box key={day} textAlign="center" fontWeight="bold">
          {day}
        </Box>
      ))}

      {/* Days */}
      {monthDays.map((date) => {
        const formatted = format(date, "yyyy-MM-dd");
        const record = data.find((d) => d.date === formatted);
        const color = getStatusColor(record);

        return (
          <Tooltip
            key={formatted}
            arrow
            placement="top"
            PopperProps={{
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    padding: 8, // space from edges
                  },
                },
                {
                  name: 'flip',
                  options: {
                    fallbackPlacements: ['top', 'bottom', 'right', 'left'],
                  },
                },
              ],
            }}
            title={
              record ? (
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {record.date}
                  </Typography>
                  <Typography variant="body2">Check-In: {record.checkInTime}</Typography>
                  <Typography variant="body2">Check-Out: {record.checkOutTime}</Typography>
                  <Typography variant="body2">Total: {record.totalTime}</Typography>
                </Box>
              ) : (
                <Typography variant="body2">{formatted}</Typography>
              )
            }
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: "0.9rem",
                  padding: "10px",
                  maxWidth: 250,
                  whiteSpace: "normal",
                },
              },
            }}
          >
            <Paper
              sx={{
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: color,
                color: "#fff",
                borderRadius: 3,
                textAlign: "center",
                cursor: record ? "pointer" : "default",
              }}
            >
              {date.getDate()}
            </Paper>
          </Tooltip>

        );
      })}
    </Box>
  );
};

export default MonthlyAttendanceCalendar;
