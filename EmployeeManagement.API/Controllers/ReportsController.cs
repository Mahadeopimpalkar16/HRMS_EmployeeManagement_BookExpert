using EmployeeManagement.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Reporting.NETCore;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepo;
        public ReportsController(IEmployeeRepository employeeRepo )
        {
            _employeeRepo = employeeRepo;
        }

        private IActionResult GenerateReport(string? searchValue, string format, string fileName, string mimeType)
        {
            var employees = _employeeRepo
                .GetFilteredAsync(searchValue, "Name")
                .Result
                .OrderByDescending(e => e.DateOfJoin)
                .ToList();

            var report = new LocalReport();
            report.ReportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "EmployeeReports.rdlc");

            report.DataSources.Add(new ReportDataSource("EmployeeDataSet", employees)); // Dataset name must match RDLC

            string encoding, fileNameExtension;
            Warning[] warnings;
            string[] streamids;

            var renderedBytes = report.Render(
                format,    // e.g., "PDF", "EXCELOPENXML"
                null,      // deviceInfo
                out string mime,
                out encoding,
                out fileNameExtension,
                out streamids,
                out warnings
            );

            return File(renderedBytes, mimeType, fileName);
        }
        [HttpGet("GeneratePDFReport")]
        public IActionResult GeneratePDFReport([FromQuery] string? SearchValue)
        {
            return GenerateReport(
                searchValue: SearchValue,
                format: "PDF",
                fileName: "EmployeeReport.pdf",
                mimeType: "application/pdf"
            );
        }

        [HttpGet("GenerateExcelReport")]
        public IActionResult ExportToExcel([FromQuery] string? SearchValue)
        {
            return GenerateReport(
                searchValue: SearchValue,
                format: "EXCELOPENXML", // or "Excel" for old XLS
                fileName: "EmployeeReport.xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        }

        [HttpGet("GenerateCSVReport")]
        public IActionResult GenerateCSVReport([FromQuery] string? SearchValue)
        {
            return GenerateReport(
                searchValue: SearchValue,
                format: "CSV",
                fileName: "EmployeeReport.CSV",
                mimeType: "test/csv"
            );
        }

        [HttpGet("GenerateWordReport")]
        public IActionResult GenerateWordReport([FromQuery] string? SearchValue)
        {
            return GenerateReport(
                searchValue: SearchValue,
                format: "WORDOPENXML",
                fileName: "EmployeeReport.docx",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
        }

    }

}
