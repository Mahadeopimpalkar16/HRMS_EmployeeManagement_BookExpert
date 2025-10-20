using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;


namespace EmployeeManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<States> States { get; set; }
        public DbSet<EmployeeAttendance> EmployeeAttendances { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>().ToTable("Employees", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<States>().ToTable("States", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<Department>().ToTable("Departments", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<Designation>().ToTable("Designations", t => t.ExcludeFromMigrations());
            modelBuilder.Entity<EmployeeAttendance>().ToTable("EmployeeAttendances", t => t.ExcludeFromMigrations());



            modelBuilder.Entity<EmployeeAttendance>().HasKey(e => new { e.EmployeeId, e.Date });
            modelBuilder.Entity<EmployeeAttendance>()
                .HasOne(e => e.Employee)
                .WithMany()
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);



        }
    }


}
