/**
 * PDF Generator Module
 * Handles professional PDF generation with corporate styling
 */

function generatePDF(metadata) {
  if (!metadata) {
    throw new Error("No metadata provided for PDF generation");
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 25;

  let currentY = 30;

  // Simple Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("FOLDER ANALYSIS REPORT", margin, currentY);
  
  currentY += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, currentY);
  
  // Simple line separator
  currentY += 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 20;

  // Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Title:", margin, currentY);
  
  currentY += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const titleText = metadata.title || "Untitled Project";
  doc.text(titleText, margin, currentY);
  
  currentY += 20;

  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Description:", margin, currentY);
  
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(metadata.description || "No description available", pageWidth - (margin * 2));
  doc.text(descLines, margin, currentY);
  
  currentY += (descLines.length * 5) + 20;

  // Tags
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Tags:", margin, currentY);
  
  currentY += 8;
  const tags = metadata.tags || [];
  if (tags.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const tagsText = tags.join(", ");
    const tagLines = doc.splitTextToSize(tagsText, pageWidth - (margin * 2));
    doc.text(tagLines, margin, currentY);
    currentY += (tagLines.length * 5) + 20;
  } else {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text("No tags available", margin, currentY);
    currentY += 20;
  }

  // Simple footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text("Folder Metadata Generator", margin, footerY);
  doc.text(`Document ID: ${Date.now().toString().slice(-6)}`, pageWidth - 50, footerY);

  return doc;
}

function createProfessionalFilename(title) {
  const cleanTitle = (title || "folder_metadata")
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  return `folder_analysis_${cleanTitle}_${timestamp}.pdf`;
}

// Export for use in other modules
window.PDFGenerator = {
  generatePDF,
  createProfessionalFilename
};
