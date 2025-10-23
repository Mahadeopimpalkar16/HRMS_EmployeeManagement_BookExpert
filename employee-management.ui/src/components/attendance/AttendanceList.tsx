import {
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Box,
    Pagination,
} from "@mui/material";
import WeeklyProgressBar from "./WeeklyProgressBar";
import type { AttendanceSummary } from "../../types/attendance";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AttendanceService } from '../../services/attendanceService';
interface Props{
    attendanceData: AttendanceSummary[];
}

const AttendanceList : React.FC<Props>= ({
    attendanceData,
}) => {
    const navigate = useNavigate();
    const [data, setData] = useState<AttendanceSummary[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const filteredData = attendanceData.filter(emp =>
        emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchValue.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchValue.toLowerCase())
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
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, val) => setCurrentPage(val)}
                />
            </Box>
        </Box>
    );
};

export default AttendanceList;
