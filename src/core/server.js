const express = require('express');
const bodyParser = require('body-parser');
const config = require('../../config');

class MCPServer {
  constructor(mcpManager, port = config.server.port) {
    this.mcpManager = mcpManager;
    this.port = port;
    this.app = express();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(bodyParser.json());

    // 工具发现端点
    this.app.get('/api/tools', (req, res) => {
      const tools = this.mcpManager.listTools().map(tool => tool.getInfo());
      res.json({
        tools
      });
    });

    // 工具执行端点
    this.app.post('/api/execute', async (req, res) => {
      const { tool, params } = req.body;
      
      if (!tool) {
        return res.status(400).json({
          success: false,
          error: 'Tool name is required'
        });
      }

      try {
        const result = await this.mcpManager.executeTool(tool, params);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // 市场发布端点
    this.app.get('/api/market/publish', (req, res) => {
      const tools = this.mcpManager.listTools().map(tool => tool.getInfo());
      
      res.json({
        ...config.market.metadata,
        tools,
        endpoints: {
          tools: '/api/tools',
          execute: '/api/execute',
          health: '/health',
          market: '/api/market/publish'
        }
      });
    });

    // 健康检查端点
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
      });
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, (error) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(`MCP Server running on port ${this.port}`);
        resolve();
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('MCP Server stopped');
    }
  }
}

module.exports = MCPServer;