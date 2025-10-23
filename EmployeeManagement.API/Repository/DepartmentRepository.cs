using EmployeeManagement.API.Data;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Repository
{
    public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
    {
        private readonly AppDbContext _db;
        public DepartmentRepository(AppDbContext context) : base(context)
        {
            _db = context;
        }

        public async new Task<IEnumerable<Department>> GetAllAsync()
        {
            var departments = await _db.Departments
                .Include(e => e.Designations)
                .ToListAsync();
            return departments;
        }

        public async new Task<Department> GetByIdAsync(int id)
        {
            var departments = await _db.Departments
                .Include(e => e.Designations)
                .FirstOrDefaultAsync(d => d.DeptId == id);
            return departments ?? new Department();
        }
    }
}
