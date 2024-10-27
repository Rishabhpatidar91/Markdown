const WebSocket = require('ws');
const marked = require('marked');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    const markdownText = message.toString();
    const htmlContent = marked.parse(markdownText);
    ws.send(htmlContent);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
