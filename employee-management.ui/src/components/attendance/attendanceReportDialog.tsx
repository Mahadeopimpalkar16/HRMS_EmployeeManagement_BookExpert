import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import type { AttendanceSummary } from "../../types/attendance";

interface Props {
    open: boolean;
    onClose: () => void;
    dailyAttendance: AttendanceSummary[];
}

const AttendanceReportDialog: React.FC<Props> = ({ open, onClose, dailyAttendance }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Attendance Report</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow >
                            <TableCell><strong>Employee Name</strong></TableCell>
                            <TableCell><strong>Department</strong></TableCell>
                            <TableCell><strong>Designation</strong></TableCell>
                            <TableCell><strong>Day Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dailyAttendance.map((e) => (
                            <TableRow key={e.employeeId}>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.department}</TableCell>
                                <TableCell>{e.designation}</TableCell>
                                <TableCell>{e.dayStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AttendanceReportDialog;
