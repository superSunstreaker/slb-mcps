const http = require('http');

const postData = JSON.stringify({
  tool: 'ai-prompt',
  params: {
    action: 'generate-component',
    componentType: 'ls-button'
  }
});

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/execute',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应结束');
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入数据到请求体
req.write(postData);
req.end();