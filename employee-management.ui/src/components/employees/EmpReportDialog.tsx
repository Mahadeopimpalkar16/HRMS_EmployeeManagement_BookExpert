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
import type { Employee } from "../../types/employee";

interface Props {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
}

const EmpReportDialog: React.FC<Props> = ({ open, onClose, employees }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Employee Report</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Designation</strong></TableCell>
              <TableCell><strong>Salary</strong></TableCell>
              <TableCell><strong>Date Of Join</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.designation.designationName}</TableCell>
                <TableCell>{e.salary}</TableCell>
                <TableCell>{new Date(e.dateOfJoin).toLocaleDateString()}</TableCell>
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

export default EmpReportDialog;
