namespace EmployeeManagement.API.Models
{
    public class Designation
    {
        public int DesignationId { get; set; }
        public string Title { get; set; }
        public int DepartmentId { get; set; }
        public ICollection<Employee> Employees { get; set; }
    }

}
