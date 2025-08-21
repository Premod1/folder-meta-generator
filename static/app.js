function buildTree(files) {
  const root = { name: "/", type: "folder", children: {} };
  for (const file of files) {
    const parts = file.webkitRelativePath.split("/");
    let node = root;
    parts.forEach((part, idx) => {
      const last = idx === parts.length - 1;
      if (last) {
        node.children[part] = { type: "file", name: part, size: file.size };
      } else {
        node.children[part] ||= { type: "folder", name: part, children: {} };
        node = node.children[part];
      }
    });
  }
  function finalize(n) {
    if (n.type === "folder") {
      n.children = Object.values(n.children).map(finalize);
    }
    return n;
  }
  return finalize(root);
}

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

let currentMetadata = null;

document.addEventListener("DOMContentLoaded", () => {
  const folderInput = document.getElementById("folder");
  const analyzeBtn = document.getElementById("analyze");
  const result = document.getElementById("result");
  const resultsSection = document.getElementById("results-section");
  const exportJsonBtn = document.getElementById("export-json");
  const exportPdfBtn = document.getElementById("export-pdf");

  // Enable analyze button when folder is selected
  folderInput.addEventListener("change", () => {
    if (folderInput.files.length > 0) {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<i class="fas fa-cogs"></i> Generate Metadata';
      
      // Update the upload section to show selected folder
      const uploadSection = document.querySelector('.upload-section');
      const folderName = folderInput.files[0].webkitRelativePath.split('/')[0];
      uploadSection.querySelector('p').innerHTML = `
        <strong>Selected:</strong> ${folderName} 
        <span style="color: #27ae60;">(${folderInput.files.length} files)</span>
      `;
    } else {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '<i class="fas fa-cogs"></i> Generate Metadata';
    }
  });

  analyzeBtn.addEventListener("click", async () => {
    if (!folderInput.files.length) {
      showError("Please select a folder first.");
      return;
    }

    // Show results section and loading state
    resultsSection.style.display = "block";
    showLoading();
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
      const tree = buildTree(folderInput.files);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tree })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      currentMetadata = data;
      showSuccess(data);

      // Scroll to results
      resultsSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error("Error:", error);
      showError(error.message || "Failed to generate metadata");
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = '<i class="fas fa-cogs"></i> Generate Metadata';
    }
  });

  // Export JSON functionality
  exportJsonBtn.addEventListener("click", () => {
    if (!currentMetadata) {
      alert("No metadata to export. Please generate metadata first.");
      return;
    }

    const dataStr = JSON.stringify(currentMetadata, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(currentMetadata.title || "folder_metadata").replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // Export PDF functionality
  exportPdfBtn.addEventListener("click", () => {
    if (!currentMetadata) {
      alert("No metadata to export. Please generate metadata first.");
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Corporate Header with Blue Background
      doc.setFillColor(52, 152, 219); // Professional blue
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Company Logo Area (simulated with icon)
      doc.setFillColor(255, 255, 255);
      doc.circle(25, 22, 8, 'F');
      doc.setTextColor(52, 152, 219);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("📁", 21, 26);

      // Header Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text("FOLDER ANALYSIS REPORT", 45, 22);
      
      // Subtitle
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Professional Metadata Analysis", 45, 32);

      // Date and Status
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 80, 18);
      doc.text("Status: COMPLETED", pageWidth - 80, 28);

      // Main Content Area
      let currentY = 65;
      doc.setTextColor(0, 0, 0);

      // Project Title Section with Background
      doc.setFillColor(236, 240, 241);
      doc.rect(margin, currentY - 5, contentWidth, 25, 'F');
      doc.setDrawColor(189, 195, 199);
      doc.rect(margin, currentY - 5, contentWidth, 25, 'S');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text("PROJECT OVERVIEW", margin + 5, currentY + 8);
      currentY += 35;

      // Title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 152, 219);
      doc.text("Title:", margin, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const titleText = currentMetadata.title || "Untitled Folder";
      doc.text(titleText, margin + 25, currentY);
      currentY += 20;

      // Description Section
      doc.setFillColor(248, 249, 250);
      const descStartY = currentY - 5;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 152, 219);
      doc.text("Description:", margin, currentY);
      currentY += 15;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 55, 55);
      const descLines = doc.splitTextToSize(currentMetadata.description || "No description available", contentWidth - 10);
      
      // Background for description
      const descHeight = (descLines.length * 6) + 20;
      doc.rect(margin, descStartY, contentWidth, descHeight, 'F');
      doc.setDrawColor(223, 230, 233);
      doc.rect(margin, descStartY, contentWidth, descHeight, 'S');
      
      doc.text(descLines, margin + 5, currentY);
      currentY += (descLines.length * 6) + 25;

      // Tags Section
      doc.setFillColor(236, 240, 241);
      doc.rect(margin, currentY - 5, contentWidth, 30, 'F');
      doc.setDrawColor(189, 195, 199);
      doc.rect(margin, currentY - 5, contentWidth, 30, 'S');

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 152, 219);
      doc.text("Keywords & Tags:", margin + 5, currentY + 8);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const tags = currentMetadata.tags || [];
      
      if (tags.length > 0) {
        // Create tag boxes
        let tagX = margin + 5;
        let tagY = currentY + 18;
        
        tags.forEach((tag, index) => {
          const tagWidth = doc.getTextWidth(tag) + 8;
          
          // Check if tag fits on current line
          if (tagX + tagWidth > pageWidth - margin) {
            tagX = margin + 5;
            tagY += 12;
          }
          
          // Tag background
          doc.setFillColor(52, 152, 219);
          doc.roundedRect(tagX, tagY - 3, tagWidth, 8, 2, 2, 'F');
          
          // Tag text
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.text(tag, tagX + 4, tagY + 2);
          
          tagX += tagWidth + 5;
        });
        currentY = tagY + 15;
      } else {
        doc.text("No tags available", margin + 5, currentY + 18);
        currentY += 35;
      }

      // Analysis Details Section
      currentY += 20;
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, currentY - 5, contentWidth, 40, 'F');
      doc.setDrawColor(189, 195, 199);
      doc.rect(margin, currentY - 5, contentWidth, 40, 'S');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text("ANALYSIS DETAILS", margin + 5, currentY + 8);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(85, 85, 85);
      doc.text(`Analysis Method: AI-Powered Metadata Generation`, margin + 5, currentY + 20);
      doc.text(`Processing Date: ${new Date().toLocaleString()}`, margin + 5, currentY + 30);

      // Professional Footer
      const footerY = pageHeight - 30;
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(2);
      doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 152, 219);
      doc.text("Folder Metadata Generator", margin, footerY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(127, 140, 141);
      doc.text("Professional Analysis Tool - Powered by Advanced AI", margin, footerY + 8);
      doc.text(`Document ID: ${Date.now()}`, pageWidth - 80, footerY);
      doc.text("CONFIDENTIAL", pageWidth - 80, footerY + 8);

      // Watermark (optional)
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({opacity: 0.1}));
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(50);
      doc.text("ANALYSIS", pageWidth/2 - 30, pageHeight/2, {angle: 45});
      doc.restoreGraphicsState();

      // Download with professional filename
      const cleanTitle = (currentMetadata.title || "folder_metadata")
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `folder_analysis_${cleanTitle}_${timestamp}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  });
});
