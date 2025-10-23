using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace EmployeeManagement.API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IDepartmentService _service;
        //private readonly IMapper _mapper;

        public DepartmentController(AppDbContext context, IDepartmentService service)
        {
            _context = context;
            _service = service;
        }

        // ✅ GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetDepartments()
        {

            var departments =  await _service.GetAllAsync();
            return Ok(departments);

            //var departments = await _context.Departments
            //    .Include(d => d.Designations)
            //    .ToListAsync();

            //return Ok(_mapper.Map<IEnumerable<DepartmentDTO>>(departments));
        }

        // ✅ GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartment(int id)
        {

            var dept = await _service.GetByIdAsync(id);
            return Ok(dept);

            //var department = await _context.Departments
            //    .Include(d => d.Designations)
            //    .FirstOrDefaultAsync(d => d.DeptId == id);

            //if (department == null)
            //    return NotFound();

            //return Ok(_mapper.Map<DepartmentDTO>(department));
        }

        // ✅ CREATE
        [HttpPost]
        public async Task<ActionResult> CreateDepartment(CreateDepartmentDTO dto)
        {
            var dept = await _service.CreateAsync(dto);

            //var department = new Department
            //{
            //    DeptName = dto.DeptName,
            //    Designations = dto.Designations.Select(d => new Designation
            //    {
            //        DesignationName = d.DesignationName
            //    }).ToList()
            //};

            //_context.Departments.Add(department);
            //await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepartment), new { id = dept.DeptId },dto);
        }

        // ✅ UPDATE
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDepartment(int id, CreateDepartmentDTO dto)
        {
            var department = await _service.UpdateAsync(id, dto);
            return Ok(department);
            //var department = await _context.Departments
            //    .Include(d => d.Designations)
            //    .FirstOrDefaultAsync(d => d.DeptId == id);

            //if (department == null)
            //    return NotFound();

            //// Update department fields
            //department.DeptName = dto.DeptName;

            //// Remove old designations
            //_context.Designations.RemoveRange(department.Designations);

            //// Add new designations
            //department.Designations = dto.Designations.Select(d => new Designation
            //{
            //    DesignationName = d.DesignationName,
            //    DeptId = id
            //}).ToList();

            //await _context.SaveChangesAsync();
            //return NoContent();
        }

        // ✅ DELETE
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDepartment(int id)
        {
            var existingDept = await _service.GetByIdAsync(id);

            if (existingDept == null) return NotFound("Department not found");

            await _service.DeleteAsync(id);
            return Ok($"Department deleted Successfully: Id = {id}");

            //var department = await _context.Departments
            //    .Include(d => d.Designations)
            //    .FirstOrDefaultAsync(d => d.DeptId == id);

            //if (department == null)
            //    return NotFound();

            //_context.Designations.RemoveRange(department.Designations);
            //_context.Departments.Remove(department);

            //await _context.SaveChangesAsync();
            //return NoContent();
        }
    }
}
