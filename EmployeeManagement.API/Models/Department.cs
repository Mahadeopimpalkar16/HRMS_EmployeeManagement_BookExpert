using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.API.Models
{
    public class Department
    {
        [Key]
        public int DeptId { get; set; }
        [Required]
        public string DeptName { get; set; }

        public ICollection<Designation> Designations { get; set; } = new List<Designation>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }

}
