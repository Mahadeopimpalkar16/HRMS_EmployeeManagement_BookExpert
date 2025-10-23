using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repository
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<IEnumerable<Employee>> GetFilteredAsync(string searchValue, string searchColumn );
        new Task<Employee?> GetByIdAsync(int id); // Hidden base method.
        new Task<IEnumerable<Employee>> GetAllAsync();
        Task BulkDeleteAsync(IEnumerable<int> employeeIds);
        Task<Employee?> GetEmployeeByEmail(string email);
        Task<IEnumerable<States>> GetAllStates();
        
    }
}
