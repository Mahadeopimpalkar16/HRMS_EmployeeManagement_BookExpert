import { useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import type { CreateEmployee, Employee } from "../../types/employee";

interface Props {
  employees: Employee[];
  onEdit: (employee: any) => void;
  onDelete: (id: number) => void;
  selectedIds: number[];
  onSelectAll: (ids: number[]) => void;
  rowDeleteDisabled: boolean;
}

const EmployeeList: React.FC<Props> = ({
  employees,
  onEdit,
  onDelete,
  selectedIds,
  onSelectAll,
  rowDeleteDisabled,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // Columns definition
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(params.row);
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: "designation", headerName: "Designation", flex: 1 },
    {
      field: "dateOfJoin",
      headerName: "Date Of Join",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
      },
    },
    { field: "salary", headerName: "Salary", type: "number", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "state", headerName: "State", flex: 1 },
    {
      field: "dateOfBirth",
      headerName: "Date Of Birth",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onDelete(params.row.id)}
          disabled={localStorage.getItem("access") == "read" ||
            rowDeleteDisabled }

        >
          Delete
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  // Transform employees into rows with guaranteed `id`
  const rows = employees.map((e, index) => ({
    ...e,
    id: e.id ?? index,
  }));

  // Pagination
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize;
  const currentPageRows = rows.slice(start, end);

  // Total salary
  const totalSalaryCurrentPage = currentPageRows
    .reduce((sum, row) => sum + (parseFloat(row.salary as any) || 0), 0)
    .toFixed(2);

  // Handle selection change
  const handleSelectionModelChange = (model: GridRowSelectionModel) => {
    const selectedArray = Array.from(model.ids).map(id => Number(id));
    onSelectAll(selectedArray);
  };

  return (
    <div style={{ height: 420, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        selectionModel={{ type: "checkbox", ids: selectedIds }}
        onRowSelectionModelChange={handleSelectionModelChange}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            color: "black",
            fontWeight: "bold",
            fontSize: "1.1rem",
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#e0f7fa",
          },
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {/* <strong>Total Salary: ₹ {totalSalaryCurrentPage}</strong> */}
      </div>
    </div>
  );
};

export default EmployeeList;
