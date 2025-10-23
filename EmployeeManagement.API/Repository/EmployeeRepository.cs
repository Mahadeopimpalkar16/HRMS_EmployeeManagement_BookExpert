using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Repository
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        private readonly AppDbContext _context;
        public EmployeeRepository(AppDbContext context) : base(context) { _context = context; }

        public async Task<IEnumerable<Employee>> GetFilteredAsync(string searchValue, string searchColumn)
        {
            if (!string.IsNullOrEmpty(searchColumn))
            {
                var isValidColumn = typeof(Employee).GetProperties()
                    .Any(p => p.Name.Equals(searchColumn)
                    && p.PropertyType == typeof(string));

                if (!isValidColumn)
                {
                    throw new ArgumentException($"Invalid Search column : {searchColumn}");
                }
            }
            var query = _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchValue) && !string.IsNullOrWhiteSpace(searchColumn))
            {
                query = query.Where(e =>
                    EF.Property<string>(e, searchColumn).Contains(searchValue));
            }

            return await query.ToListAsync();
        }
        public async new Task<IEnumerable<Employee>> GetAllAsync()
        {
            var employees = await _context.Employees
                                .Include(e => e.Department)
                                .Include(e => e.Designation)
                                .ToListAsync();
            return employees;
        }
        public async new Task<Employee?> GetByIdAsync(int id)
        {
            var employee = await _context.Employees
             .Include(e => e.Department)
             .Include(e => e.Designation)
             .FirstOrDefaultAsync(e => e.Id == id);

            return employee;
        }

        public async Task BulkDeleteAsync(IEnumerable<int> employeeIds)
        {
            var employees = _context.Employees.Where(e => employeeIds.Contains(e.Id));
            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(string name) =>
            await _context.Employees.AnyAsync(e => e.Name == name);

        public async Task<Employee> GetEmployeeByEmail(string email)
        {
            var employee = await _context.Employees
             .Include(e => e.Designation)
             .Where(e=>e.Email == email)
             .FirstOrDefaultAsync();

            return employee;
        }
        public async Task<IEnumerable<States>> GetAllStates()
        {
            return await _context.States.ToListAsync();
        }


    }
}
