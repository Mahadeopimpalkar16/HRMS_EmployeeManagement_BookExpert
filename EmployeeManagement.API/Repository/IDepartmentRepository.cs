using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repository
{
    public interface IDepartmentRepository : IGenericRepository<Department>
    {
        new Task<IEnumerable<Department>> GetAllAsync();
        new Task<Department> GetByIdAsync(int id);
    }
}
