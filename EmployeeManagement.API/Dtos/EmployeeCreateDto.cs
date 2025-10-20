namespace EmployeeManagement.API.Dtos
{
    public class EmployeeCreateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public DateTime DateOfJoin { get; set; }
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
    }
}
