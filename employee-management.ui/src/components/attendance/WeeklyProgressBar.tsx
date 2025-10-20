import { LinearProgress, Typography, Box } from "@mui/material";

const WeeklyProgressBar = ({ value }: { value: number }) => (
  <Box width="100%">
    <Typography variant="body2" color="textSecondary">
      {Math.round(value)}%
    </Typography>
    <LinearProgress variant="determinate" value={value} />
  </Box>
);

export default WeeklyProgressBar;
