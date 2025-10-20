import {
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Box,
    Pagination,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import WeeklyProgressBar from "./WeeklyProgressBar";
import type { AttendanceSummary, DailyAttendance } from "./types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AttendanceService } from '../../services/attendanceService';
import DashboardToolbar from "../toolbar/DashboardToolbar";
import { downloadAttendanceReport } from "../../services/newReportService";
import AttendanceChart from "./AttendanceChart";
import AttendanceChartDialog from "./AttendanceChartDialog";
import AttendanceStatusChart from "./MonthlyAttendanceCalendar";


const AttendanceList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<AttendanceSummary[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const [showChartDialog, setShowChartDialog] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
  const [chartData, setChartData] = useState<DailyAttendance[]>([]);

    const filteredData = data.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const recordsPerPage = 10;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);


    useEffect(() => {
        AttendanceService.fetchAttendanceList()
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error fetching attendance list:", err));

    }, []);
    return (
        <Box>
            <h2 style={{ textAlign: "center" }}>Daily Attendance List</h2>
            <DashboardToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                onDownloadPdf={downloadAttendanceReport.pdf}
                onDownloadExcel={downloadAttendanceReport.excel}
                onShowChart={() => setShowChartDialog(true)}
                onViewReport={() => setShowReportDialog(true)}

            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Weekly Progress</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentRecords.map((emp) => (
                        <TableRow
                            key={emp.employeeId}
                            hover
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/attendance/${emp.employeeId}`)}
                        >
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.designation}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.dayStatus}</TableCell>
                            <TableCell>
                                <WeeklyProgressBar value={emp.weeklyPercent} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={totalPages} // You can calculate this dynamically later
                    page={currentPage}
                    onChange={(_, val) => setCurrentPage(val)}
                />
            </Box>
            <AttendanceChartDialog
                open={showChartDialog}
                onClose={() => setShowChartDialog(false)}
                attendanceData={filteredData}
            />
        </Box>
    );
};

export default AttendanceList;
