using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEmployeeRepository _repo;
        public AuthController(AppDbContext db, IEmployeeRepository repo)
        {
            _db = db;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Check if email exists in Employees table
            var employeeExists = await _repo.GetEmployeeByEmail(user.Username);
            
            if (employeeExists == null)
                return BadRequest("Email not found in employee records.");

            // Check if user already registered
            if (await _db.Users.AnyAsync(u => u.Username == user.Username))
                return BadRequest("User already registered.");

            user.PasswordHash = HashPassword(user.PasswordHash);
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok("Registration successful.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var dbUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (dbUser == null || dbUser.PasswordHash != HashPassword(user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var employee = await _repo.GetEmployeeByEmail(user.Username);

            if (employee == null)
                return BadRequest("Employee record not found.");

            return Ok(employee);
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
