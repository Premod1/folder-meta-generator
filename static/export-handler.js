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

  // Create worksheet data
  const worksheetData = [];
  
  // Add header row
  worksheetData.push([
    'Folder Title',
    'Filename', 
    'Description',
    'Tags'
  ]);

  // Add file data rows
  if (metadata.files && Array.isArray(metadata.files)) {
    metadata.files.forEach(file => {
      worksheetData.push([
        metadata.title || 'Unknown Folder',
        file.filename || 'Unknown File',
        file.description || 'No description',
        (file.tags && Array.isArray(file.tags)) ? file.tags.join(', ') : 'No tags'
      ]);
    });
  } else {
    // Fallback for old format or missing files
    worksheetData.push([
      metadata.title || 'Unknown Folder',
      'No files found',
      metadata.description || 'No description available',
      (metadata.tags && Array.isArray(metadata.tags)) ? metadata.tags.join(', ') : 'No tags'
    ]);
  }

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  // Set column widths for better formatting
  const colWidths = [
    { wch: 25 }, // Folder Title
    { wch: 30 }, // Filename
    { wch: 50 }, // Description
    { wch: 30 }  // Tags
  ];
  worksheet['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "File Metadata");
  
  // Generate filename
  const safeTitle = (metadata.title || "folder_metadata").replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeTitle}.xlsx`;
  
  // Save the file
  XLSX.writeFile(workbook, filename);
}

// Export for use in other modules
window.ExportHandler = {
  exportToJSON,
  exportToPDF,
  exportToExcel
};
