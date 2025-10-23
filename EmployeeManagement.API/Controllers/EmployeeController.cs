using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;
using EmployeeManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Controllers
{
    [Route("api/[controller]/[action]/")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmployeeService _service;
        public EmployeesController(AppDbContext context, IEmployeeService service)
        {
            _context = context;
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetAllEmployees()
        {
            var employees = await _service.GetAllAsync();
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDTO>> GetEmployeeById(int id)
        {
            var employee = await _service.GetByIdAsync(id);
            if (employee == null) return NotFound();

            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeDTO>> CreateEmployee(CreateEmployeeDTO dto)
        {
            var isEmailExists = await _service.GetByEmailAsync(dto.Email);
            if (isEmailExists != null)
                return BadRequest("Email is already exists!.");

            var employee = await _service.CreateAsync(dto);
            //return Ok(employee);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, CreateEmployeeDTO dto)
        {
            var employee = await _service.UpdateAsync(id, dto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _service.GetByIdAsync(id);
            if (employee == null) return NotFound();

            await _service.DeleteAsync(id);
            return Ok();
        }

        [HttpDelete()]
        public async Task<IActionResult> DeleteMultiple([FromBody] List<int> employeeIds)
        {
            await _service.BulkDeleteAsync(employeeIds);
            return Ok("Deleted Successfully");
        }

        [HttpGet()]
        public async Task<IActionResult> GetAllStates()
        {
            var result = await _service.GetAllStates();
            return Ok(result);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetEmployeeByEmail(string email)
        {
            var employee = await _service.GetByEmailAsync(email);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        // will update this service and repo layer as we grow up.
        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new { d.DeptId, d.DeptName })
                .ToListAsync();

            return Ok(departments);
        }

        [HttpGet("{departmentId}")]
        public async Task<IActionResult> GetDesignationsByDeptId(int departmentId)
        {
            var designations = await _context.Designations
                .Where(d => d.DeptId == departmentId)
                .Select(d => new { d.DesignationId, d.DesignationName })
                .ToListAsync();

            return Ok(designations);
        }

    }
}
