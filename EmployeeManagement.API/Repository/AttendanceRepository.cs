
using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Repository
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly AppDbContext _context;

        public AttendanceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AttendanceDTO>> GetEmployeeAttendanceListAsync(string? searchValue = null)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(6);

            var query = _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchValue))
            {
                query = query.Where(e =>
                    e.Name.Contains(searchValue) ||
                    e.Designation.DesignationName.Contains(searchValue) ||
                    e.Department.DeptName.Contains(searchValue));
            }

            var attendanceSummary = await query
                .Select(e => new AttendanceDTO
                {
                    EmployeeId = e.Id,
                    Name = e.Name,
                    Designation = e.Designation.DesignationName,
                    Department = e.Department.DeptName,
                    DayStatus = _context.EmployeeAttendances
                        .Where(a => a.EmployeeId == e.Id && a.Date == today)
                        .Select(a => a.Status)
                        .FirstOrDefault() ?? "Absent",
                    WeeklyPercent = _context.EmployeeAttendances
                        .Where(a => a.EmployeeId == e.Id && a.Date >= startOfWeek && a.Date <= endOfWeek && a.Status == "Present")
                        .Count() * 100 / 7
                })
                .ToListAsync();

            return attendanceSummary;
        }
    }

}
