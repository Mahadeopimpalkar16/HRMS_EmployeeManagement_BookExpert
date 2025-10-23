using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing.Printing;

namespace EmployeeManagement.API.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Precision(10, 2)]
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfJoin { get; set; }
        public string Email { get; set; }



        [ForeignKey(nameof(Department))]
        public int DeptId { get; set; }

        [ForeignKey(nameof(Designation))]
        public int DesignationId { get; set; }

        // Navigation properties of One-One
        public Designation Designation { get; set; }
        public Department Department { get; set; }

        // Navigation properties of One-Many
        public ICollection<EmployeeAttendance> Attendances { get; set; } = new List<EmployeeAttendance>();


    }

}
