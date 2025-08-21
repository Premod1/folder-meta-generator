/**
 * Tree Builder Module
 * Handles folder structure analysis and tree building
 */

function buildTree(files) {
  const root = { name: "/", type: "folder", children: {} };
  
  for (const file of files) {
    const parts = file.webkitRelativePath.split("/");
    let node = root;
    
    parts.forEach((part, idx) => {
      const last = idx === parts.length - 1;
      if (last) {
        node.children[part] = { 
          type: "file", 
          name: part, 
          size: file.size 
        };
      } else {
        node.children[part] ||= { 
          type: "folder", 
          name: part, 
          children: {} 
        };
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

// Export for use in other modules
window.TreeBuilder = {
  buildTree
};
