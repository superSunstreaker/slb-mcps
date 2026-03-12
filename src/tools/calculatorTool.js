const ToolBase = require('../core/toolBase');

class CalculatorTool extends ToolBase {
  constructor() {
    super(
      'calculator',
      'Simple calculator tool for basic arithmetic operations',
      [
        {
          name: 'operation',
          type: 'string',
          required: true,
          description: 'Arithmetic operation: add, subtract, multiply, divide'
        },
        {
          name: 'a',
          type: 'number',
          required: true,
          description: 'First operand'
        },
        {
          name: 'b',
          type: 'number',
          required: true,
          description: 'Second operand'
        }
      ]
    );
  }

  async execute(params) {
    const { operation, a, b } = params;
    
    switch (operation) {
      case 'add':
        return { result: a + b };
      case 'subtract':
        return { result: a - b };
      case 'multiply':
        return { result: a * b };
      case 'divide':
        if (b === 0) {
          throw new Error('Division by zero');
        }
        return { result: a / b };
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }
}

module.exports = CalculatorTool;