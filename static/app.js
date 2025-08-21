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

document.addEventListener("DOMContentLoaded", () => {
  const folderInput = document.getElementById("folder");
  const analyzeBtn = document.getElementById("analyze");
  const result = document.getElementById("result");

  analyzeBtn.addEventListener("click", async () => {
    if (!folderInput.files.length) {
      alert("Please select a folder first.");
      return;
    }
    const tree = buildTree(folderInput.files);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tree })
    });
    const data = await res.json();
    result.textContent = JSON.stringify(data, null, 2);

    // ✅ Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(data.title || "Generated Folder", 10, 20);

    doc.setFontSize(12);
    const descLines = doc.splitTextToSize(data.description || "No description", 180);
    doc.text("Description:", 10, 35);
    doc.text(descLines, 10, 45);

    doc.text("Tags:", 10, 45 + descLines.length * 7 + 10);
    doc.text((data.tags || []).join(", "), 10, 45 + descLines.length * 7 + 20);

    // Download PDF automatically
    doc.save(`${data.title || "folder_metadata"}.pdf`);
  });
});
