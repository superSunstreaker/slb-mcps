class ToolBase {
  constructor(name, description, parameters) {
    this.name = name;
    this.description = description;
    this.parameters = parameters || [];
  }

  async execute(params) {
    throw new Error('Execute method must be implemented');
  }

  getInfo() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters
    };
  }
}

module.exports = ToolBase;