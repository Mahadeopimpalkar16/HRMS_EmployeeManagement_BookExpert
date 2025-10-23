using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.API.Models
{
    public class Designation
    {
        [Key]
        public int DesignationId { get; set; }
        [Required]
        public string DesignationName { get; set; }


        [ForeignKey(nameof(Department))]
        public int DeptId { get; set; }

        public Department Department { get; set; }
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }

}
