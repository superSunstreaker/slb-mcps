module.exports = {
  server: {
    port: 3004,
    host: 'localhost'
  },
  tools: {
    directory: './src/tools'
  },
  market: {
    enabled: true,
    publishEndpoint: '/api/market/publish',
    metadata: {
      name: 'SLB MCP Framework',
      version: '1.0.0',
      description: 'Model Context Protocol framework for TRAE',
      author: 'SLB',
      tags: ['MCP', 'TRAE', 'tool integration']
    }
  }
};