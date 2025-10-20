using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;
        public EmployeeRepository(AppDbContext context) { _context = context; }

        public async Task<IEnumerable<EmployeeDto>> GetFilteredEmployeesAsync(string searchValue, string searchColumn)
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
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    DepartmentName = e.Department.Name,
                    Designation = e.Designation.Title,
                    DateOfJoin = e.DateOfJoin,
                    Salary = e.Salary,
                    Gender = e.Gender,
                    Email = e.Email,
                    State = e.State,
                    DateOfBirth = e.DateOfBirth
                })
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchValue) && !string.IsNullOrWhiteSpace(searchColumn))
            {
                query = query.Where(e =>
                    EF.Property<string>(e, searchColumn).Contains(searchValue));
            }

            return await query.ToListAsync();
        }
        public async Task<IEnumerable<EmployeeDto>> GetAllEmployeesAsync()
        {
            var employees = await _context.Employees
                                .Include(e => e.Department)
                                .Include(e => e.Designation)
                                .Select(e => new EmployeeDto
                                {
                                    Id = e.Id,
                                    Name = e.Name,
                                    DepartmentName = e.Department.Name,
                                    Designation = e.Designation.Title,
                                    DateOfJoin = e.DateOfJoin,
                                    Salary = e.Salary,
                                    Email = e.Email,
                                    Gender = e.Gender,
                                    State = e.State,
                                    DateOfBirth = e.DateOfBirth
                                })
                                .ToListAsync();
            return employees;
        }
        public async Task<IEnumerable<States>> GetAllStates()
        {
            return await _context.States.ToListAsync();
        }

        public async Task<EmployeeDto> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
             .Include(e => e.Department)
             .Include(e => e.Designation)
             .Select(e => new EmployeeDto
             {
                 Id = e.Id,
                 Name = e.Name,
                 DepartmentName = e.Department.Name,
                 Designation = e.Designation.Title,
                 DateOfJoin = e.DateOfJoin,
                 Salary = e.Salary,
                 Email = e.Email,
                 Gender = e.Gender,
                 State = e.State,
                 DateOfBirth = e.DateOfBirth
             })
             .FirstOrDefaultAsync(e => e.Id == id);

            return employee;
        }

        public async Task<EmployeeDto> GetEmployeeByUsernameAsync(int id)
        {
            var employee = await _context.Employees
             .Include(e => e.Department)
             .Include(e => e.Designation)
             .Select(e => new EmployeeDto
             {
                 Id = e.Id,
                 Name = e.Name,
                 DepartmentName = e.Department.Name,
                 Designation = e.Designation.Title,
                 DateOfJoin = e.DateOfJoin,
                 Salary = e.Salary,
                 Gender = e.Gender,
                 Email = e.Email,
                 State = e.State,
                 DateOfBirth = e.DateOfBirth
             })
             .FirstOrDefaultAsync(e => e.Id == id);

            return employee;
        }
        public async Task AddEmployeeAsync(EmployeeCreateDto dto)
        {
            var employee = new Employee
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId,
                DesignationId = dto.DesignationId,
                DateOfJoin = dto.DateOfJoin,
                Salary = dto.Salary,
                Gender = dto.Gender,
                State = dto.State,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateEmployeeAsync(int id, EmployeeCreateDto dto)
        {
            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
                throw new KeyNotFoundException($"Employee with ID {id} not found.");

            existingEmployee.Name = dto.Name;
            existingEmployee.DepartmentId = dto.DepartmentId;
            existingEmployee.DesignationId = dto.DesignationId;
            existingEmployee.DateOfJoin = dto.DateOfJoin;
            existingEmployee.Salary = dto.Salary;
            existingEmployee.Gender = dto.Gender;
            existingEmployee.State = dto.State;
            existingEmployee.DateOfBirth = dto.DateOfBirth;
            existingEmployee.Email = dto.Email;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp != null)
            {
                _context.Employees.Remove(emp);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteEmployeesAsync(IEnumerable<int> employeeIds)
        {
            var employees = _context.Employees.Where(e => employeeIds.Contains(e.Id));
            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmployeeExistsAsync(string name) =>
            await _context.Employees.AnyAsync(e => e.Name == name);

        public async Task<UserDto> GetEmployeeByEmail(string email)
        {
            var employee = await _context.Employees
             .Include(e => e.Designation)
             .Where(e=>e.Email == email)
             .Select(e => new UserDto
             {
                 EmployeeId = e.Id,
                 Username = e.Email,
                 Role = e.Designation.Title,
                 Access = (e.Designation.Title.ToLower().Contains("hr") || e.Designation.Title.ToLower().Contains("manager")) ? "write" : "read"
             })
             .FirstOrDefaultAsync();

            return employee;
        }

    }
}
