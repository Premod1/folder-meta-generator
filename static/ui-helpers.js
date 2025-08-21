/**
 * UI Helper Module
 * Handles UI state changes, loading states, and user feedback
 */

function showLoading() {
  const result = document.getElementById("result");
  result.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i> 
      Analyzing folder structure... Please wait.
    </div>
  `;
}

function showError(message) {
  const result = document.getElementById("result");
  result.innerHTML = `
    <div class="error">
      <i class="fas fa-exclamation-triangle"></i> 
      Error: ${message}
    </div>
  `;
}

function showSuccess(data) {
  const result = document.getElementById("result");
  result.innerHTML = `
    <div class="success" style="margin-bottom: 20px;">
      <i class="fas fa-check-circle"></i> 
      Analysis completed successfully!
    </div>
    <div style="color: #ecf0f1;">
${JSON.stringify(data, null, 2)}
    </div>
  `;
}

function updateUploadSection(files) {
  if (files.length > 0) {
    const uploadSection = document.querySelector('.upload-section');
    const folderName = files[0].webkitRelativePath.split('/')[0];
    uploadSection.querySelector('p').innerHTML = `
      <strong>Selected:</strong> ${folderName} 
      <span style="color: #27ae60;">(${files.length} files)</span>
    `;
  }
}

function setAnalyzeButtonState(disabled, text) {
  const analyzeBtn = document.getElementById("analyze");
  analyzeBtn.disabled = disabled;
  analyzeBtn.innerHTML = text;
}

function scrollToResults() {
  const resultsSection = document.getElementById("results-section");
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showResultsSection() {
  const resultsSection = document.getElementById("results-section");
  resultsSection.style.display = "block";
}

// Export for use in other modules
window.UIHelpers = {
  showLoading,
  showError,
  showSuccess,
  updateUploadSection,
  setAnalyzeButtonState,
  scrollToResults,
  showResultsSection
};
