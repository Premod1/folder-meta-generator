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
  
  let filesHtml = '';
  if (data.files && Array.isArray(data.files)) {
    filesHtml = data.files.map(file => `
      <div class="file-item" style="margin-bottom: 15px; padding: 10px; background: rgba(52, 73, 94, 0.3); border-radius: 5px;">
        <h4 style="margin: 0 0 5px 0; color: #3498db;">
          <i class="fas fa-file"></i> ${file.filename}
        </h4>
        <h5 style="margin: 0 0 8px 0; color: #f39c12; font-size: 14px;">
          <i class="fas fa-tag"></i> ${file.title || 'Untitled'}
        </h5>
        <p style="margin: 5px 0; color: #ecf0f1;">${file.description}</p>
        <div class="tags" style="margin-top: 8px;">
          ${file.tags ? file.tags.map(tag => `
            <span style="background: #27ae60; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-right: 5px;">${tag}</span>
          `).join('') : ''}
        </div>
      </div>
    `).join('');
  }
  
  result.innerHTML = `
    <div class="success" style="margin-bottom: 20px;">
      <i class="fas fa-check-circle"></i> 
      Analysis completed successfully!
    </div>
    <div style="color: #ecf0f1; margin-bottom: 20px;">
      <h3 style="color: #e74c3c; margin-bottom: 15px;">
        <i class="fas fa-folder"></i> ${data.title || 'Folder Analysis'}
      </h3>
      <div class="files-list">
        ${filesHtml}
      </div>
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
