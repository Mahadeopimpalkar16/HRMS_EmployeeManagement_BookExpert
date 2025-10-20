import { Button } from "@mui/material";

const AttendanceReportButton = () => {
  const handleExport = () => {
    // Trigger backend report generation
    console.log("Exporting report...");
  };

  return <Button variant="outlined" onClick={handleExport}>Export Report</Button>;
};

export default AttendanceReportButton;
