import axios from "axios";

const BASE_URL = "https://localhost:7264/api/Reports";

// 🧾 PDF Report
export const downloadPDFReport = async (searchValue?: string): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/GeneratePDFReport`, {
    params: { searchValue: searchValue || "" },
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  downloadFile(blob, "Employee_Report.pdf");
};

export const downloadExcelReport = async (searchValue?: string): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/GenerateExcelReport`, {
    params: { searchValue: searchValue || "" },
    responseType: "blob",
  });
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadFile(blob, "Employee_Report.xlsx");
};

export const downloadCSVReport = async (searchValue?: string): Promise<void> => {
  const response = await axios.get(`${BASE_URL}/GenerateCSVReport`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "text/csv" });
  downloadFile(blob, "Employee_Report.csv");
};

// 📁 Utility
const downloadFile = (blob: Blob, fileName: string): void => {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};
