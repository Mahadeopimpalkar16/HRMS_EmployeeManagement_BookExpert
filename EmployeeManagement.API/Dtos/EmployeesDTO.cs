namespace EmployeeManagement.API.Dtos
{
    // DTOs/CreateEmployeeDTO.cs
    public class CreateEmployeeDTO
    {
        public string Name { get; set; }
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfJoin { get; set; }
        public string Email { get; set; }
        public int DeptId { get; set; }
        public int DesignationId { get; set; }
    }

    // DTOs/EmployeeDTO.cs
    public class EmployeeDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Salary { get; set; }
        public string Gender { get; set; }
        public string State { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfJoin { get; set; }
        public string Email { get; set; }
        public int DeptId { get; set; }
        public int DesignationId { get; set; }

        public DepartmentDTO Department { get; set; }
        public DesignationDTO Designation { get; set; }
    }

    // DTOs/DepartmentDTO.cs
    public class DepartmentDTO
    {
        public int DeptId { get; set; }
        public string DeptName { get; set; }
        public List<DesignationDTO> Designations { get; set; } = new();

    }

    // DTOs/DesignationDTO.cs
    public class DesignationDTO
    {
        public int DesignationId { get; set; }
        public string DesignationName { get; set; }
    }

    public class CreateDepartmentDTO
    {
        public string DeptName { get; set; }
        public List<DesignationDTO> Designations { get; set; } = new();

    }


}
