using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DesignationId { get; set; }
        public Designation Designation { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public DateTime DateOfJoin { get; set; }
        [Precision(10, 2)] // Restricts the digit to 2 digits after the decimal point
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; } // Optional field
        public string Email { get; set; }

    }

}
