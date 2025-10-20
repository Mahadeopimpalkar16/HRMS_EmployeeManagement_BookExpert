namespace EmployeeManagement.API.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string Name { get; set; }

        public ICollection<Employee> Employees { get; set; }
    }

}
