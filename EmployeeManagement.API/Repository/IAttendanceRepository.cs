using EmployeeManagement.API.Dtos;

namespace EmployeeManagement.API.Repository
{
    public interface IAttendanceRepository
    {
        Task<IEnumerable<Attendance>> GetEmployeeAttendanceListAsync(string? searchValue);
    }
}
