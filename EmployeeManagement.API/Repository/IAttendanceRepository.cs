using EmployeeManagement.API.Dtos;

namespace EmployeeManagement.API.Repository
{
    public interface IAttendanceRepository
    {
        Task<IEnumerable<AttendanceDTO>> GetEmployeeAttendanceListAsync(string? searchValue);
    }
}
