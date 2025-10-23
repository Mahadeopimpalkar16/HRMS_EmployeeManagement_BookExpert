import React from "react";
import {
  Box,
  Button,
} from "@mui/material";

interface Props {
  onAdd: () => void;
  onMultiDelete: () => void;
  multiDeleteDisabled: boolean;
  addDisabled: boolean;
}

const EmployeeToolbar: React.FC<Props> = ({
  onAdd,
  onMultiDelete,
  multiDeleteDisabled,
  addDisabled,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      sx={{ mb: 2 }}
    >
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={localStorage.getItem("access") == "read" || addDisabled}
        >
          Add
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onMultiDelete}
          disabled={ localStorage.getItem("access") == "read" || multiDeleteDisabled}
        >
          Delete Selected
        </Button>
      </Box>

      {/* <Box display="flex" alignItems="center" gap={1} ml="auto">
        <Tooltip title="View Charts">
          <IconButton onClick={setShowChart} color="primary">
            <InsertChartIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download PDF">
          <IconButton onClick={() => onDownloadPdf(searchValue)} color="secondary">
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download Excel">
          <IconButton onClick={() => onDownloadExcel(searchValue)} color="success">
            <GridOnIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="View Report">
          <IconButton onClick={onViewReport} color="warning">
            <DescriptionIcon />
          </IconButton>
        </Tooltip>

        <TextField
          placeholder="Search by name"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box> */}
    </Box>
  );
};

export default EmployeeToolbar;
