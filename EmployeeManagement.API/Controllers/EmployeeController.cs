using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _repo;
        private readonly AppDbContext _context; 
        public EmployeeController(IEmployeeRepository repo, AppDbContext context)
        {
            _repo = repo;
            _context = context;
        }

        // Used in API level searching
        [HttpGet("[action]")]
        public async Task<IActionResult> SearchDataBySearchParameter([FromQuery] string? searchValue, [FromQuery] string searchColumn = "Name" )
        {
            var employees = await _repo.GetFilteredEmployeesAsync(searchValue, searchColumn);
            employees.OrderByDescending(o => o.DateOfJoin);
            return Ok(employees);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _repo.GetAllEmployeesAsync();
            var result = employees.OrderByDescending(o => o.DateOfJoin).ToList();
            return Ok(result);
        }
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await _repo.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateDto employee)
        {
            if (await _repo.EmployeeExistsAsync(employee.Name))
                return BadRequest("Duplicate record found.");

            await _repo.AddEmployeeAsync(employee);
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeCreateDto employee)
        {
            if (id != employee.Id) return BadRequest();
            await _repo.UpdateEmployeeAsync(id, employee);
            return Ok("Updated Successfully");
        }

        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            await _repo.DeleteEmployeeAsync(id);
            return Ok("Deleted Successfully");
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteMultiple([FromBody] List<int> employeeIds)
        {
            await _repo.DeleteEmployeesAsync(employeeIds);
            return Ok("Deleted Successfully");
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetAllStates()
        {
            var result = await _repo.GetAllStates();
            return Ok(result);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetEmployeeByEmail(string email)
        {
            var employee = await _repo.GetEmployeeByEmail(email);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new { d.DepartmentId, d.Name })
                .ToListAsync();

            return Ok(departments);
        }

        [HttpGet("[action]/{departmentId}")]
        public async Task<IActionResult> GetDesignationsByDepartment(int departmentId)
        {
            var designations = await _context.Designations
                .Where(d => d.DepartmentId == departmentId)
                .Select(d => new { d.DesignationId, d.Title })
                .ToListAsync();

            return Ok(designations);
        }

    }
}
