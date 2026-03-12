class MCPManager {
  constructor() {
    this.tools = new Map();
  }

  registerTool(tool) {
    if (!tool.name || !tool.execute) {
      throw new Error('Tool must have a name and execute method');
    }
    this.tools.set(tool.name, tool);
    console.log(`Tool registered: ${tool.name}`);
  }

  getTool(name) {
    return this.tools.get(name);
  }

  listTools() {
    return Array.from(this.tools.values());
  }

  async executeTool(toolName, params) {
    const tool = this.getTool(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }

    try {
      const result = await tool.execute(params);
      return {
        success: true,
        result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = MCPManager;