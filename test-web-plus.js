const http = require('http');

// 测试生成Web Plus按钮组件
const postData = JSON.stringify({
  tool: 'ai-prompt',
  params: {
    action: 'generate-component',
    componentType: 'wp-button',
    config: '我需要一个主要按钮'
  }
});

const options = {
  hostname: 'localhost',
  port: 3004,
  path: '/api/execute',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应体: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

req.write(postData);
req.end();