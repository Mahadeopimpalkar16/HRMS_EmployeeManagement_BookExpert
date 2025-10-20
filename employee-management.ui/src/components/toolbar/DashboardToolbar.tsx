import { Box, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOnOutlined";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";

interface DashboardToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onDownloadPdf?: (searchValue?: string) => void;
  onDownloadExcel?: (searchValue?: string) => void;
  onShowChart?: () => void;
  onViewReport?: (searchValue?: string) => void;
}

const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  searchValue,
  onSearchChange,
  onDownloadPdf,
  onDownloadExcel,
  onShowChart,
  onViewReport,
}) => (
  <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1} mb={2}>
    {onShowChart && (
      <Tooltip title="View Charts">
        <IconButton onClick={onShowChart} color="primary">
          <InsertChartIcon />
        </IconButton>
      </Tooltip>
    )}
    {onDownloadPdf && (
      <Tooltip title="Download PDF">
        <IconButton onClick={() => onDownloadPdf(searchValue)} color="secondary">
          <PictureAsPdfIcon />
        </IconButton>
      </Tooltip>
    )}
    {onDownloadExcel && (
      <Tooltip title="Download Excel">
        <IconButton onClick={() => onDownloadExcel(searchValue)} color="success">
          <GridOnIcon />
        </IconButton>
      </Tooltip>
    )}
    {onViewReport && 
    <Tooltip title="View Report">
      <IconButton onClick={() => onViewReport(searchValue)} color="warning">
        <DescriptionIcon />
      </IconButton>
    </Tooltip>

    }
    <TextField
      placeholder="Search..."
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
  </Box>
);
export default DashboardToolbar