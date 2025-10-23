namespace EmployeeManagement.API.Dtos
{
    public class AttendanceDTO
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public string Department { get; set; }
        public string DayStatus { get; set; }
        public int WeeklyPercent { get; set; }
    }

}
