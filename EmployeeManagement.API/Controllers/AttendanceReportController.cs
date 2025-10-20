using EmployeeManagement.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Reporting.NETCore;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceReportsController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IAttendanceRepository _attendanceRepo;

        public AttendanceReportsController(IEmployeeRepository employeeRepo, IAttendanceRepository attendanceRepo)
        {
            _employeeRepo = employeeRepo;
            _attendanceRepo = attendanceRepo;
        }

        private IActionResult GenerateReport<T>(
            IEnumerable<T> data,
            string rdlcFileName,
            string datasetName,
            string format,
            string fileName,
            string mimeType)
        {
            var report = new LocalReport();
            report.ReportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", rdlcFileName);
            report.DataSources.Add(new ReportDataSource(datasetName, data));

            string encoding, fileNameExtension;
            Warning[] warnings;
            string[] streamids;

            var renderedBytes = report.Render(
                format,
                null,
                out string mime,
                out encoding,
                out fileNameExtension,
                out streamids,
                out warnings
            );

            return File(renderedBytes, mimeType, fileName);
        }

        // 🔹 Employee Reports
        [HttpGet("EmployeeReport/{format}")]
        public async Task<IActionResult> GenerateEmployeeReport(string format, [FromQuery] string? searchValue)
        {
            var employees = await _employeeRepo.GetFilteredEmployeesAsync(searchValue, "Name");
            var sorted = employees.OrderByDescending(e => e.DateOfJoin).ToList();

            return GenerateReport(
                sorted,
                "EmployeeReports.rdlc",
                "EmployeeDataSet",
                format.ToUpper(),
                $"EmployeeReport.{GetExtension(format)}",
                GetMimeType(format)
            );
        }

        // 🔹 Attendance Reports
        [HttpGet("AttendanceReport/{format}")]
        public async Task<IActionResult> GenerateAttendanceReport(string format, [FromQuery] string? searchValue)
        {
            var attendanceList = await _attendanceRepo.GetEmployeeAttendanceListAsync(searchValue);

            return GenerateReport(
                attendanceList,
                "AttendanceReport.rdlc",
                "AttendanceReportDataset",
                format.ToUpper(),
                $"AttendanceReport.{GetExtension(format)}",
                GetMimeType(format)
            );
        }

        // 🔹 Helpers
        private string GetExtension(string format) => format.ToLower() switch
        {
            "pdf" => "pdf",
            "excelopenxml" => "xlsx",
            "csv" => "csv",
            "wordopenxml" => "docx",
            _ => "dat"
        };

        private string GetMimeType(string format) => format.ToLower() switch
        {
            "pdf" => "application/pdf",
            "excelopenxml" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "csv" => "text/csv",
            "wordopenxml" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };
    }
}
