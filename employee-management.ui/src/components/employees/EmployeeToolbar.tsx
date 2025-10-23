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
    </Box>
  );
};

export default EmployeeToolbar;
