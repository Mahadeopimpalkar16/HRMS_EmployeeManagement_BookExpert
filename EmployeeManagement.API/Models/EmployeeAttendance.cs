namespace EmployeeManagement.API.Models
{
    public class EmployeeAttendance
    {
        public int EmployeeId { get; set; }
        public DateOnly Date { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public TimeSpan? TotalTime { get; set; }
        public string Status { get; set; } // Present, Absent, Leave

        public Employee Employee { get; set; }
    }
}
