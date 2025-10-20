using EmployeeManagement.API.Data;
using EmployeeManagement.API.Dtos;
using EmployeeManagement.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("checkin")]
        public async Task<IActionResult> CheckIn(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var attendance = await _context.EmployeeAttendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance != null && attendance.CheckInTime != null && attendance.CheckOutTime == null)
            {
                return BadRequest("Already checked in. Please check out before checking in again.");
            }

            if (attendance == null)
            {
                attendance = new EmployeeAttendance
                {
                    EmployeeId = employeeId,
                    Date = today,
                    CheckInTime = DateTime.Now,
                    Status = "Present"
                };
                _context.EmployeeAttendances.Add(attendance);
            }
            else
            {
                attendance.CheckInTime = DateTime.Now;
                attendance.CheckOutTime = null;
                attendance.Status = "Present";
            }

            await _context.SaveChangesAsync();
            return Ok(attendance);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> CheckOut(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var attendance = await _context.EmployeeAttendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance == null || attendance.CheckInTime == null)
                return NotFound("Check-in required before check-out.");

            if (attendance.CheckOutTime != null)
                return BadRequest("Already checked out.");

            attendance.CheckOutTime = DateTime.Now;

            var sessionDuration = attendance.CheckOutTime.Value - attendance.CheckInTime.Value;

            // Accumulate with existing TotalTime
            var existingTotal = attendance.TotalTime ?? TimeSpan.Zero;
            var updatedTotal = existingTotal + sessionDuration;

            attendance.TotalTime = TimeSpan.FromSeconds(Math.Floor(updatedTotal.TotalSeconds));

            await _context.SaveChangesAsync();
            return Ok(attendance);
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayStatus(int employeeId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var attendance = await _context.EmployeeAttendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == today);

            if (attendance == null)
                return Ok(new { status = "Not Checked In" });

            return Ok(new
            {
                status = attendance.CheckOutTime == null ? "Checked In" : "Checked Out",
                checkInTime = attendance.CheckInTime,
                checkOutTime = attendance.CheckOutTime,
                totalTime = attendance.TotalTime?.ToString(@"hh\:mm\:ss") ?? "00:00:00"
            });
        }

        [HttpGet("weekly-summary")]
        public async Task<IActionResult> GetWeeklySummary(int employeeId, int weekOffset)
        {
            var today = DateTime.Today;
            var firstOfMonth = new DateTime(today.Year, today.Month, 1);

            // Find the Sunday before or on the 1st of the month
            var firstWeekStart = firstOfMonth.AddDays(-(int)firstOfMonth.DayOfWeek);

            // Calculate start of requested week
            var startOfWeek = firstWeekStart.AddDays(weekOffset * 7);
            var endOfWeek = startOfWeek.AddDays(6);

            var attendanceRecords = await _context.EmployeeAttendances
                .Where(a => a.EmployeeId == employeeId &&
                            a.Date >= DateOnly.FromDateTime(startOfWeek) &&
                            a.Date <= DateOnly.FromDateTime(endOfWeek))
                .ToDictionaryAsync(a => a.Date);

            var expectedMinutes = 8 * 60;
            var result = new List<object>();

            for (int i = 0; i < 7; i++)
            {
                var date = DateOnly.FromDateTime(startOfWeek.AddDays(i));
                if (attendanceRecords.TryGetValue(date, out var record))
                {
                    result.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        checkInTime = record.CheckInTime?.ToString("HH:mm") ?? "-",
                        checkOutTime = record.CheckOutTime?.ToString("HH:mm") ?? "-",
                        totalTime = record.TotalTime?.ToString(@"hh\:mm") ?? "00:00",
                        percent = record.TotalTime.HasValue
                            ? Math.Min(100, (int)(record.TotalTime.Value.TotalMinutes / expectedMinutes * 100))
                            : 0
                    });
                }
                else
                {
                    result.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        checkInTime = "-",
                        checkOutTime = "-",
                        totalTime = "00:00",
                        percent = 0
                    });
                }
            }

            return Ok(result);

        }
        [HttpGet("monthly-summary")]
        public async Task<IActionResult> GetMonthlySummary(int employeeId, int? year = null, int? month = null)
        {
            var today = DateTime.Today;
            int y = year ?? today.Year;
            int m = month ?? today.Month;

            var firstOfMonth = new DateTime(y, m, 1);
            var lastOfMonth = new DateTime(y, m, DateTime.DaysInMonth(y, m));

            var attendanceRecords = await _context.EmployeeAttendances
                .Where(a => a.EmployeeId == employeeId &&
                            a.Date >= DateOnly.FromDateTime(firstOfMonth) &&
                            a.Date <= DateOnly.FromDateTime(lastOfMonth))
                .ToDictionaryAsync(a => a.Date);

            var expectedMinutes = 8 * 60;
            var result = new List<object>();

            foreach (var date in Enumerable.Range(0, lastOfMonth.Day)
                .Select(d => firstOfMonth.AddDays(d)))
            {
                if (attendanceRecords.TryGetValue(DateOnly.FromDateTime(date), out var record))
                {
                    result.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        checkInTime = record.CheckInTime?.ToString("HH:mm") ?? "-",
                        checkOutTime = record.CheckOutTime?.ToString("HH:mm") ?? "-",
                        totalTime = record.TotalTime?.ToString(@"hh\:mm") ?? "00:00",
                        percent = record.TotalTime.HasValue
                            ? Math.Min(100, (int)(record.TotalTime.Value.TotalMinutes / expectedMinutes * 100))
                            : 0
                    });
                }
                else
                {
                    result.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        checkInTime = "-",
                        checkOutTime = "-",
                        totalTime = "00:00",
                        percent = 0
                    });
                }
            }

            return Ok(result);
        }

        [HttpGet("attendance-list")]
        public async Task<IEnumerable<Attendance>> GetEmployeeAttendanceListAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(6);

            var attendanceSummary = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Select(e => new Attendance
                {
                    EmployeeId = e.Id,
                    Name = e.Name,
                    Designation = e.Designation.Title,
                    Department = e.Department.Name,
                    DayStatus = _context.EmployeeAttendances
                        .Where(a => a.EmployeeId == e.Id && a.Date == today)
                        .Select(a => a.Status)
                        .FirstOrDefault() ?? "Absent",
                    WeeklyPercent = _context.EmployeeAttendances
                        .Where(a => a.EmployeeId == e.Id && a.Date >= startOfWeek && a.Date <= endOfWeek && a.Status == "Present")
                        .Count() * 100 / 7
                })
                .ToListAsync();
            
            return attendanceSummary;
        }
    }
}
