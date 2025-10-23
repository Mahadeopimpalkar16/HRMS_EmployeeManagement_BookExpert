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
            base.OnModelCreating(modelBuilder);

            // Department → Designations (1-to-many)
            modelBuilder.Entity<Department>()
                .HasMany(d => d.Designations)
                .WithOne(ds => ds.Department)
                .HasForeignKey(ds => ds.DeptId)
                .OnDelete(DeleteBehavior.Restrict);

            // Department → Employees (1-to-many)
            modelBuilder.Entity<Department>()
                .HasMany(d => d.Employees)
                .WithOne(e => e.Department)
                .HasForeignKey(e => e.DeptId)
                .OnDelete(DeleteBehavior.Restrict);

            // Designation → Employees (1-to-many)
            modelBuilder.Entity<Designation>()
                .HasMany(ds => ds.Employees)
                .WithOne(e => e.Designation)
                .HasForeignKey(e => e.DesignationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employees → EmployeeAttendance (1-to-many)
            modelBuilder.Entity<EmployeeAttendance>().HasKey(e => new { e.EmployeeId, e.Date });
            modelBuilder.Entity<EmployeeAttendance>()
                .HasOne(e => e.Employee)
                .WithMany(aa => aa.Attendances)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);


        }

    }
}
