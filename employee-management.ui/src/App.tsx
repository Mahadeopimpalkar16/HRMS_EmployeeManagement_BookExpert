import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AttendanceDetails from "./components/attendance/AttendanceDetails";
import AuthGuard from "./components/login/AuthGuard";
import Login from "./components/login/login";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Dashboard/>
          </AuthGuard>
        }
      />
      <Route
        path="/attendance/:employeeId"
        element={
            <AuthGuard>
              <AttendanceDetails />
            </AuthGuard>
          
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;
