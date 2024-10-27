import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import  hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // You can choose other themes from highlight.js

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onmessage = (event) => {
      setHtml(event.data);
    };

    return () => ws.close();
  }, []);

  const handleMarkdownChange = (text) => {
    setMarkdown(text);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(text);
    }
  };

  return (
    <div style={{ width:'80%',margin:'auto',display: 'flex', gap: '20px' }}>
      <div style={{ width: '50%' }}>
        <h3>Markdown Editor</h3>
        <Editor
          value={markdown}
          onValueChange={handleMarkdownChange}
          highlight={(code) => hljs.highlight(code, { language: 'markdown' }).value}
          padding={10}
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            minHeight: '220px',
            border: '1px solid #ddd',
          }}
        />
      </div>
      <div style={{ width: '50%' }}>
        <h3>Live Preview</h3>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            minHeight: '200px',
          }}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
