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
import EmployeeChart from "./EmployeeManagement.Charts";
import type{ Employee } from "../../types/employee";

interface Props {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
}

const EmployeeChartDialog: React.FC<Props> = ({ open, onClose, employees }) => {
  const [chartType, setChartType] = useState<"pie" | "bar" | "line">("pie");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Salary Distribution by Designation
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

        <EmployeeChart employees={employees} type={chartType} />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeChartDialog;
