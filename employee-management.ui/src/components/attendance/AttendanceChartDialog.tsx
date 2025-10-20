import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PieChartIcon from "@mui/icons-material/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AttendanceChart from "./AttendanceChart";
import type { AttendanceSummary } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  attendanceData: AttendanceSummary[];
}

const AttendanceChartDialog: React.FC<Props> = ({
  open,
  onClose,
  attendanceData,
}) => {
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("pie");
  const [category, setCategory] = useState<"status" | "department">("status");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Attendance Chart ({category === "status" ? "By Status" : "By Department"})
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Chart Type Buttons */}
        <Stack direction="row" spacing={2} mb={2}>
          <Tooltip title="Pie Chart">
            <IconButton
              color={chartType === "pie" ? "primary" : "default"}
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bar Chart">
            <IconButton
              color={chartType === "bar" ? "primary" : "default"}
              onClick={() => setChartType("bar")}
            >
              <BarChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Line Chart">
            <IconButton
              color={chartType === "line" ? "primary" : "default"}
              onClick={() => setChartType("line")}
            >
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Category Toggle */}
        <Stack direction="row" spacing={2} mb={2}>
          <Tooltip title="View by Status">
            <IconButton
              color={category === "status" ? "secondary" : "default"}
              onClick={() => setCategory("status")}
            >
              S
            </IconButton>
          </Tooltip>
          <Tooltip title="View by Department">
            <IconButton
              color={category === "department" ? "secondary" : "default"}
              onClick={() => setCategory("department")}
            >
              D
            </IconButton>
          </Tooltip>
        </Stack>

        <AttendanceChart
          data={attendanceData}
          type={chartType}
          category={category}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceChartDialog;
