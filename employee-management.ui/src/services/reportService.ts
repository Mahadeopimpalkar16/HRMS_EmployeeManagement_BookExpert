import axios from "axios";

const BASE_URL = "https://localhost:7264/api/AttendanceReports";

// Generic Report Downloader
const downloadReport = async (
  reportType: "EmployeeReport" | "AttendanceReport",
  format: "pdf" | "excelopenxml" | "csv" | "wordopenxml",
  searchValue?: string
): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/${reportType}/${format}`, {
    params: searchValue ? { searchValue } : {},
    responseType: "blob",
  });

  const mimeType = getMimeType(format);
  const fileExtension = getFileExtension(format);
  const fileName = `${reportType}_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;

  const blob = new Blob([response.data], { type: mimeType });
  downloadFile(blob, fileName);
};

// Trigger download
const downloadFile = (blob: Blob, fileName: string): void => {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

// Helpers
const getMimeType = (format: string): string => {
  switch (format.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "excelopenxml":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "csv":
      return "text/csv";
    case "wordopenxml":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

const getFileExtension = (format: string): string => {
  switch (format.toLowerCase()) {
    case "pdf":
      return "pdf";
    case "excelopenxml":
      return "xlsx";
    case "csv":
      return "csv";
    case "wordopenxml":
      return "docx";
    default:
      return "dat";
  }
};

export const downloadEmployeeReport = {
  pdf: (searchValue?: string) => downloadReport("EmployeeReport", "pdf", searchValue),
  excel: (searchValue?: string) => downloadReport("EmployeeReport", "excelopenxml", searchValue),
  csv: (searchValue?: string) => downloadReport("EmployeeReport", "csv", searchValue),
  word: (searchValue?: string) => downloadReport("EmployeeReport", "wordopenxml", searchValue),
};

export const downloadAttendanceReport = {
  pdf: (searchValue?: string) => downloadReport("AttendanceReport", "pdf", searchValue),
  excel: (searchValue?: string) => downloadReport("AttendanceReport", "excelopenxml", searchValue),
  csv: (searchValue?: string) => downloadReport("AttendanceReport", "csv", searchValue),
  word: (searchValue?: string) => downloadReport("AttendanceReport", "wordopenxml", searchValue),
};
