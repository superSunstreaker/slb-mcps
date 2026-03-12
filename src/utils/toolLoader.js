const fs = require('fs');
const path = require('path');

function loadTools(toolsDir) {
  const tools = [];
  
  try {
    const files = fs.readdirSync(toolsDir);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const toolPath = path.join(toolsDir, file);
        const ToolClass = require(toolPath);
        const tool = new ToolClass();
        tools.push(tool);
        console.log(`Loaded tool: ${tool.name}`);
      }
    }
  } catch (error) {
    console.error('Error loading tools:', error);
  }
  
  return tools;
}

module.exports = { loadTools };