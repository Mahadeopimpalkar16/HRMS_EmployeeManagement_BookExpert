import React, { useEffect, useState } from "react";
import {
  fetchEmployees,
  fetchStates,
  deleteEmployee,
  deleteMultipleEmployees,
  addEmployee,
  updateEmployee,
} from "../../services/employeeService";
import { downloadEmployeeReport } from "../../services/newReportService";

import EmployeeList from "./EmployeeManagement.List";
import EmployeeForm from "./EmployeeManagement.CreateEmpForm";
import EmployeeToolbar from "./EmployeeManagement.Toolbar";

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import type { CreateEmployee, Employee } from "../../types/employee";
import AttendancePanel from "../attendance/AttendancePanel";
import DashboardToolbar from "../toolbar/DashboardToolbar";
import { Box } from "@mui/material";
import EmpReportDialog from "./EmployeeManagement.ReportDialog";
import EmployeeChartDialog from "./EmployeeManagement.ChartDialog";

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"single" | "multi">("single");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setEmployees(await fetchEmployees());
      setStates(await fetchStates());
    };
    loadData();
  }, []);

  const filteredEmployees = employees.filter((e) =>
    e.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowForm(true);
  };

  const confirmDelete = (mode: "single" | "multi", id: number | null = null) => {
    setDeleteMode(mode);
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteMode === "single" && deleteTargetId !== null) {
      await deleteEmployee(deleteTargetId);
    } else if (deleteMode === "multi") {
      await deleteMultipleEmployees(selectedIds);
      setSelectedIds([]);
    }
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
    setEmployees(await fetchEmployees());
  };

  const handleFormSubmit = async (employee: any, editing: boolean) => {
    if (editing) {
      await updateEmployee(employee);
    } else {
      await addEmployee(employee);
    }
    setShowForm(false);
    setEmployees(await fetchEmployees());
  };

  const handleSelectAll = (ids: number[]) => setSelectedIds(ids);

  const handleViewReport = () => setShowReportDialog(true);

  return (
    <div className="container mt-4" style={{ overflow: "visible", width: "100%" }} >
      <h2 style={{ textAlign: "center" }}>Employees Managemant</h2>

      <AttendancePanel employeeId={45} />
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={1} gap={2}>
        <EmployeeToolbar
          onAdd={handleAdd}
          addDisabled={selectedIds.length > 0}
          onMultiDelete={() => confirmDelete("multi")}
          multiDeleteDisabled={selectedIds.length === 0}
        />
        <DashboardToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onDownloadPdf={downloadEmployeeReport.pdf}
          onDownloadExcel={downloadEmployeeReport.excel}
          onShowChart={() => setShowChartDialog(true)}
          onViewReport={handleViewReport}
        />
      </Box>

      <EmployeeList
        employees={filteredEmployees}
        onEdit={handleEdit}
        onDelete={(id) => confirmDelete("single", id)}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        rowDeleteDisabled={selectedIds.length > 0}
      />

      {showForm && (
        <EmployeeForm
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          employee={editingEmployee}
          states={states}
        />
      )}

      <EmployeeChartDialog
        open={showChartDialog}
        onClose={() => setShowChartDialog(false)}
        employees={employees}
      />

      <EmpReportDialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        employees={filteredEmployees}
      />

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {deleteMode === "multi"
            ? "Are you sure you want to delete the selected employees?"
            : "Are you sure you want to delete this employee?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default EmployeeManagement;
