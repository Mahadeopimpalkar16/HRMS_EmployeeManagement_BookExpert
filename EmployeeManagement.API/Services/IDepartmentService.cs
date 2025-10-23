using EmployeeManagement.API.Dtos;

namespace EmployeeManagement.API.Services
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDTO>> GetAllAsync();
        Task<DepartmentDTO> GetByIdAsync(int id);
        Task<DepartmentDTO> CreateAsync(CreateDepartmentDTO dto);
        Task<DepartmentDTO> UpdateAsync(int id, CreateDepartmentDTO dto);
        Task DeleteAsync(int id);

    }
}
