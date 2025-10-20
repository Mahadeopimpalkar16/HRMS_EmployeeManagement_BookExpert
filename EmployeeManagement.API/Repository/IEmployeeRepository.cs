using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repository
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<EmployeeDto>> GetFilteredEmployeesAsync(string searchValue, string searchColumn );
        Task<EmployeeDto> GetEmployeeByIdAsync(int id);
        Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync();
        Task AddEmployeeAsync(EmployeeCreateDto employee);
        Task UpdateEmployeeAsync(int id, EmployeeCreateDto employee);
        Task DeleteEmployeeAsync(int id);
        Task DeleteEmployeesAsync(IEnumerable<int> employeeIds);
        Task<bool> EmployeeExistsAsync(string name);
        Task<UserDto> GetEmployeeByEmail(string email);

        Task<IEnumerable<States>> GetAllStates();
        
    }
}
