import {
    Box,
} from "@mui/material";
import type { AttendanceSummary } from "../../types/attendance";
import { useEffect, useState } from "react";
import { AttendanceService } from '../../services/attendanceService';
import DashboardToolbar from "../toolbar/DashboardToolbar";
import { downloadAttendanceReport } from "../../services/reportService";
import AttendanceChartDialog from "./AttendanceChartDialog";
import AttendanceList from "./AttendanceList";
import AttendanceReportDialog from "./attendanceReportDialog";


const AttendanceManagement = () => {
    const [data, setData] = useState<AttendanceSummary[]>([]);
    const [searchValue, setSearchValue] = useState("");

    const [showChartDialog, setShowChartDialog] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);

    const filteredData = data.filter(emp =>
        emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchValue.toLowerCase())
    );


    useEffect(() => {
        AttendanceService.fetchAttendanceList()
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error fetching attendance list:", err));

    }, []);
    return (
        <Box>
            <h2 style={{ textAlign: "center" }}>Daily Attendance List</h2>
            <DashboardToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onDownloadPdf={downloadAttendanceReport.pdf}
                onDownloadExcel={downloadAttendanceReport.excel}
                onShowChart={() => setShowChartDialog(true)}
                onViewReport={() => setShowReportDialog(true)}
            />
            <AttendanceList
                attendanceData={filteredData}>
            </AttendanceList>

            <AttendanceChartDialog
                open={showChartDialog}
                onClose={() => setShowChartDialog(false)}
                attendanceData={filteredData}
            />
            <AttendanceReportDialog
                open={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                dailyAttendance={filteredData}
            />
        </Box>
    );
};

export default AttendanceManagement;
