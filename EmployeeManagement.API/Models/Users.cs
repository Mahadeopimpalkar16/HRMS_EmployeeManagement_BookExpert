namespace EmployeeManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }
}
