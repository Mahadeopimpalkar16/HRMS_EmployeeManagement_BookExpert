import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { AttendanceService } from "../../services/attendanceService";
import { logout } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

const AttendancePanel: React.FC<{ employeeId: number }> = ({ employeeId }) => {
  const [status, setStatus] = useState("Not Checked In");
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [loading, setLoading] = useState(false);
  const [totalTime, setTotalTime] = useState("00:00:00");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await AttendanceService.getTodayStatus(employeeId);
        const data = res.data;

        setStatus(data.status);
        setTotalTime(data.totalTime || "00:00:00");

        if (data.checkInTime && data.status === "Checked In") {
          setCheckInTime(new Date(data.checkInTime));
        } else {
          setCheckInTime(null);
        }
      } catch {
        setStatus("Not Checked In");
        setTotalTime("00:00:00");
        setCheckInTime(null);
      }
    };


    fetchStatus();
  }, [employeeId]);

  // useEffect(() => {
  //   let timer: number;

  //   if (checkInTime) {

  //     timer = window.setInterval(() => {
  //       const now = new Date();

  //       const diffMs = new Date(now.getTime() - checkInTime.getTime());
  //       const diff = new Date(diffMs);
  //       const hh = String(diff.getUTCHours()).padStart(2, "0");
  //       const mm = String(diff.getUTCMinutes()).padStart(2, "0");
  //       const ss = String(diff.getUTCSeconds()).padStart(2, "0");
  //       const  liveElapsed = `${hh}:${mm}:${ss}`;
  //       setElapsed(liveElapsed);

  //       if(status === "Checked In"){
  //         setTotalTime(totalTime + liveElapsed);
  //       }else{
  //         setTotalTime(totalTime);
  //       }
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer);
  // }, [checkInTime, status]);

useEffect(() => {
  let timer: number;

  const toSeconds = (time: string) => {
    const [hh, mm, ss] = time.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  };

  const formatTime = (seconds: number) => {
    const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  if (checkInTime) {
    const baseTotalSec = toSeconds(totalTime); // API-provided total time in seconds
    timer = window.setInterval(() => {
      const now = new Date();
      const elapsedSec = Math.floor((now.getTime() - checkInTime.getTime()) / 1000);
      setElapsed(formatTime(elapsedSec));

      // Show total time = API total + live elapsed
      setTotalTime(formatTime(baseTotalSec + elapsedSec));
    }, 1000);
  }

  return () => clearInterval(timer);
}, [checkInTime]);

  const handleCheckIn = async () => {
    setLoading(true);
    await AttendanceService.checkIn(employeeId);
    const now = new Date();
    setCheckInTime(now);
    setStatus("Checked In");
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    await AttendanceService.checkOut(employeeId);
    setStatus("Checked Out");
    setCheckInTime(null);
    setElapsed("00:00:00");
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");

  }
  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="flex-end" paddingBottom="20px">

      <Button variant="contained" color="secondary" onClick={handleLogout}>
        logout
      </Button>
      <Typography variant="h6" align="right">
        Status: {status}
        {status === "Checked In" && ` (${elapsed})`}
      </Typography>

      <Typography variant="body2" align="right" color="textSecondary">
        Total Time Today: {totalTime}
      </Typography>

      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          onClick={handleCheckIn}
          disabled={loading || status === "Checked In"}
        >
          Check In
        </Button>
        <Button
          variant="outlined"
          onClick={handleCheckOut}
          disabled={loading || status !== "Checked In"}
        >
          Check Out
        </Button>
      </Box>
    </Box>
  );
};

export default AttendancePanel;
