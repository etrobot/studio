import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("No data to export.");
    // Optionally show a toast message to the user
    return;
  }

  // Define a replacer function to handle null/undefined values and escape double quotes
  const replacer = (key: any, value: any) => {
    if (value === null || value === undefined) {
      return '';
    }
    // Convert value to string and escape double quotes by doubling them
    const stringValue = String(value);
    return stringValue.replace(/"/g, '""');
  };

  const header = Object.keys(data[0]);
  const csvRows = [
    header.join(','), // header row
    ...data.map(row => 
      header.map(fieldName => 
        // Enclose each field in double quotes
        `"${replacer(fieldName, row[fieldName])}"`
      ).join(',')
    )
  ];
  const csvString = csvRows.join('\r\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");

  if (link.download !== undefined) { // Check if the browser supports the download attribute
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Free up storage space
  } else {
    // Fallback for browsers that do not support the download attribute
    console.error("CSV export: Download attribute is not supported by your browser.");
    // Optionally, display the CSV data in a new window or provide other instructions
  }
}
