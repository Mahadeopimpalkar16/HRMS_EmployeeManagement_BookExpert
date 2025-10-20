namespace EmployeeManagement.API.Dtos
{
    public class UserDto
    {
        public int EmployeeId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Access { get; set; }
    }
}
