/**
 * Main Application Module
 * Orchestrates all functionality and handles user interactions
 */

let currentMetadata = null;

document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const folderInput = document.getElementById("folder");
  const analyzeBtn = document.getElementById("analyze");
  const exportJsonBtn = document.getElementById("export-json");
  const exportPdfBtn = document.getElementById("export-pdf");

  // Handle folder selection
  folderInput.addEventListener("change", handleFolderSelection);
  
  // Handle analysis
  analyzeBtn.addEventListener("click", handleAnalysis);
  
  // Handle exports
  exportJsonBtn.addEventListener("click", handleJSONExport);
  exportPdfBtn.addEventListener("click", handlePDFExport);
});

function handleFolderSelection() {
  const folderInput = document.getElementById("folder");
  
  if (folderInput.files.length > 0) {
    window.UIHelpers.setAnalyzeButtonState(false, '<i class="fas fa-cogs"></i> Generate Metadata');
    window.UIHelpers.updateUploadSection(folderInput.files);
  } else {
    window.UIHelpers.setAnalyzeButtonState(true, '<i class="fas fa-cogs"></i> Generate Metadata');
  }
}

async function handleAnalysis() {
  const folderInput = document.getElementById("folder");
  
  if (!folderInput.files.length) {
    window.UIHelpers.showError("Please select a folder first.");
    return;
  }

  // Show results section and loading state
  window.UIHelpers.showResultsSection();
  window.UIHelpers.showLoading();
  window.UIHelpers.setAnalyzeButtonState(true, '<i class="fas fa-spinner fa-spin"></i> Processing...');

  try {
    // Build tree and generate metadata
    const tree = window.TreeBuilder.buildTree(folderInput.files);
    const data = await window.APIClient.generateMetadata(tree);

    // Store and display results
    currentMetadata = data;
    window.UIHelpers.showSuccess(data);
    window.UIHelpers.scrollToResults();

  } catch (error) {
    console.error("Error:", error);
    window.UIHelpers.showError(error.message || "Failed to generate metadata");
  } finally {
    window.UIHelpers.setAnalyzeButtonState(false, '<i class="fas fa-cogs"></i> Generate Metadata');
  }
}

function handleJSONExport() {
  if (!currentMetadata) {
    alert("No metadata to export. Please generate metadata first.");
    return;
  }

  try {
    window.ExportHandler.exportToJSON(currentMetadata);
  } catch (error) {
    console.error("JSON export error:", error);
    alert("Failed to export JSON. Please try again.");
  }
}

function handlePDFExport() {
  if (!currentMetadata) {
    alert("No metadata to export. Please generate metadata first.");
    return;
  }

  try {
    window.ExportHandler.exportToPDF(currentMetadata);
  } catch (error) {
    console.error("PDF export error:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}
