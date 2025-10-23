using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using System.Threading.Tasks;

namespace EmployeeManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeDTO>> GetAllAsync();
        Task<IEnumerable<EmployeeDTO>> GetFilteredAsync(string coumnName, string searchValue);
        Task<EmployeeDTO?> GetByIdAsync(int id);
        Task<EmployeeDTO> CreateAsync(CreateEmployeeDTO dto);
        Task<EmployeeDTO?> UpdateAsync(int id, CreateEmployeeDTO dto);
        Task DeleteAsync(int id);
        Task<EmployeeDTO> GetByEmailAsync(string email);
        Task<IEnumerable<States>> GetAllStates();
        Task BulkDeleteAsync(IEnumerable<int> employeeIds);

    }
}
