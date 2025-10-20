using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Dtos
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Designation { get; set; }
        public string DepartmentName { get; set; }
        public DateTime DateOfJoin { get; set; }
        [Precision(10, 2)] // Restricts the digit to 2 digits after the decimal point
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; } // Optional field
        public string Email { get; set; }
    }
}
