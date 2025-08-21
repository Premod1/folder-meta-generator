/**
 * API Client Module
 * Handles communication with the backend API
 */

async function generateMetadata(tree) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tree })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

// Export for use in other modules
window.APIClient = {
  generateMetadata
};
