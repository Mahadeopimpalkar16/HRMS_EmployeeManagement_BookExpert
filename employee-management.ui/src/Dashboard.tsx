import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import AttendanceTabs from "./components/attendance/AttendanceTabs";
import EmployeeManagementTab from "./components/employees/EmployeeManagementTab";
import EmployeeManagement from "./components/employees/EmployeeManagement";

const Dashboard: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box p={3}>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Employees" />
        <Tab label="Attendance" />
      </Tabs>

      <Box mt={2}>
        {tab === 0 && <EmployeeManagement />}
        {tab === 1 && <AttendanceTabs />}
      </Box>
    </Box>
  );
};

export default Dashboard;
