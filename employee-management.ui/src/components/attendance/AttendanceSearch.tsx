import { TextField } from "@mui/material";

const AttendanceSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <TextField
      label="Search Employee"
      variant="outlined"
      fullWidth
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default AttendanceSearch;
