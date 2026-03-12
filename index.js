const path = require('path');
const MCPManager = require('./src/core/mcpManager');
const MCPServer = require('./src/core/server');
const { loadTools } = require('./src/utils/toolLoader');
const config = require('./config');

async function main() {
  // 创建MCP管理器
  const mcpManager = new MCPManager();

  // 加载所有工具
  const toolsDir = path.join(__dirname, config.tools.directory);
  const tools = loadTools(toolsDir);

  // 注册工具
  tools.forEach(tool => {
    mcpManager.registerTool(tool);
  });

  // 创建并启动服务器
  const server = new MCPServer(mcpManager);
  await server.start();

  console.log('MCP Framework initialized successfully');
  console.log(`Server running at http://${config.server.host}:${config.server.port}`);
  console.log(`Tools available: ${mcpManager.listTools().map(t => t.name).join(', ')}`);
  if (config.market.enabled) {
    console.log(`Market publish endpoint: http://${config.server.host}:${config.server.port}${config.market.publishEndpoint}`);
  }
}

main().catch(console.error);