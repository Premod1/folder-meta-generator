/**
 * Export Handler Module
 * Handles JSON and PDF export functionality
 */

function exportToJSON(metadata) {
  if (!metadata) {
    throw new Error("No metadata to export");
  }

  const dataStr = JSON.stringify(metadata, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(metadata.title || "folder_metadata").replace(/[^a-zA-Z0-9]/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToPDF(metadata) {
  if (!metadata) {
    throw new Error("No metadata to export");
  }

  try {
    const doc = window.PDFGenerator.generatePDF(metadata);
    const filename = window.PDFGenerator.createProfessionalFilename(metadata.title);
    doc.save(filename);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error("Failed to generate PDF");
  }
}

function exportToExcel(metadata) {
  if (!metadata) {
    throw new Error("No metadata to export");
  }

  const worksheet = XLSX.utils.json_to_sheet(metadata);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Metadata");
  XLSX.writeFile(workbook, `${(metadata.title || "folder_metadata").replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
}

// Export for use in other modules
window.ExportHandler = {
  exportToJSON,
  exportToPDF,
  exportToExcel
};
