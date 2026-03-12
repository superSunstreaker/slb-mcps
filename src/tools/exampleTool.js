const ToolBase = require('../core/toolBase');

class ExampleTool extends ToolBase {
  constructor() {
    super(
      'example-tool',
      'Example tool that returns a greeting message',
      [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'The name to greet'
        }
      ]
    );
  }

  async execute(params) {
    const { name } = params;
    if (!name) {
      throw new Error('Name parameter is required');
    }
    return {
      message: `Hello, ${name}! Welcome to MCP.`
    };
  }
}

module.exports = ExampleTool;