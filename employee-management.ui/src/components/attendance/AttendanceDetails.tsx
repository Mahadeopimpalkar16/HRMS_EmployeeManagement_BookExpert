import React, { useEffect, useState } from "react";
import {
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Pagination,
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import WeeklyProgressBar from "./WeeklyProgressBar";
import { useParams, useNavigate } from "react-router-dom";
import { AttendanceService } from "../../services/attendanceService";
import type { DailyAttendance } from "../../types/attendance";
import MonthlyAttendanceCalendar from "./MonthlyAttendanceCalendar";

const recordsPerWeek = 7;

const AttendanceDetails = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [monthlyData, setMonthlyData] = useState<DailyAttendance[]>([]);
    const [weeklyData, setWeeklyData] = useState<DailyAttendance[]>([]);
    const [week, setWeek] = useState(0);
    const [weekCount, setWeekCount] = useState(0);

    const [showMonthlyDialog, setShowMonthlyDialog] = useState(false);

    // Fetch full month data
    useEffect(() => {
        if (!employeeId) return;

        AttendanceService.getMonthlySummary(Number(employeeId))
            .then((res) => {
                setMonthlyData(res.data);
                setWeekCount(Math.ceil(res.data.length / recordsPerWeek));
                setWeek(0);
            })
            .catch((err) => console.error("Error fetching monthly attendance:", err));
    }, [employeeId]);

    // Slice weekly data
    useEffect(() => {
        const start = week * recordsPerWeek;
        const end = start + recordsPerWeek;
        setWeeklyData(monthlyData.slice(start, end));
    }, [week, monthlyData]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    variant="outlined"
                    onClick={() => navigate("/", { state: { tabIndex: 1 } })}
                >
                    ← Back to Attendance List
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowMonthlyDialog(true)}
                >
                    View Monthly Calendar
                </Button>
            </Box>

            <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                    Weekly Attendance Summary
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Check-In</TableCell>
                            <TableCell>Check-Out</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Daily Progress</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {weeklyData.map((day, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{day.date}</TableCell>
                                <TableCell>{day.checkInTime}</TableCell>
                                <TableCell>{day.checkOutTime}</TableCell>
                                <TableCell>{day.totalTime}</TableCell>
                                <TableCell>
                                    <WeeklyProgressBar value={day.percent} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Box mt={2} display="flex" justifyContent="center">
                    <Pagination
                        count={weekCount}
                        page={week + 1}
                        onChange={(_, val) => setWeek(val - 1)}
                    />
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" gap={2} alignItems="center">

                <Dialog open={showMonthlyDialog} onClose={() => setShowMonthlyDialog(false)} maxWidth="md" fullWidth >
                    <DialogContent>
                        <DialogTitle justifyContent={"center"}>Monthly Attendance</DialogTitle>
                        <MonthlyAttendanceCalendar data={monthlyData} />
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};

export default AttendanceDetails;
