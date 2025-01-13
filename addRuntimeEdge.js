const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "app"); // Update if your app directory is elsewhere

function addRuntimeEdge(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      // Recursively handle subdirectories
      addRuntimeEdge(fullPath);
    } else if (entry.isFile() && entry.name === "page.tsx") {
      // Only modify files named "page.tsx"
      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content.includes('export const runtime = "edge";')) {
        // Add the runtime export at the beginning of the file
        const updatedContent = `export const runtime = "edge";\n\n${content}`;
        fs.writeFileSync(fullPath, updatedContent, "utf-8");
        console.log(`Updated: ${fullPath}`);
      } else {
        console.log(`Already updated: ${fullPath}`);
      }
    }
  });
}

// Start the script
addRuntimeEdge(appDir);

console.log("Script finished running.");
