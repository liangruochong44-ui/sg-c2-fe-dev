#!/usr/bin/env node

/**
 * MiniMax MCP Server - Web Search & Image Understanding
 * Based on @ameno/pi-minimax-mcp
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const API_KEY = process.env.MINIMAX_API_KEY;
const API_HOST = process.env.MINIMAX_API_HOST || 'api.minimax.chat';
const BASE_URL = `https://${API_HOST}`;

// MCP JSON-RPC handling
let idCounter = 1;

function jsonRPC(method, params = {}) {
  return {
    jsonrpc: '2.0',
    id: idCounter++,
    method,
    params
  };
}

function makeRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

// Tools implementation
const tools = {
  'web_search': {
    name: 'web_search',
    description: 'Search the web using MiniMax web search API',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        num_results: { type: 'number', description: 'Number of results', default: 5 }
      },
      required: ['query']
    },
    execute: async ({ query, num_results = 5 }) => {
      const response = await makeRequest('/v1/search', {
        model: 'general-v2.3',
        query,
        num_results
      });
      return response;
    }
  },
  'understand_image': {
    name: 'understand_image',
    description: 'Analyze an image using MiniMax vision API',
    inputSchema: {
      type: 'object',
      properties: {
        image: { type: 'string', description: 'Image URL or base64 data URL' },
        prompt: { type: 'string', description: 'Question about the image' }
      },
      required: ['image', 'prompt']
    },
    execute: async ({ image, prompt }) => {
      const response = await makeRequest('/v1/chat/completions', {
        model: 'abab6.5s-chat',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: image } },
              { type: 'text', text: prompt }
            ]
          }
        ]
      });
      return response;
    }
  }
};

// MCP Protocol
async function handleRequest(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const rpcRequest = JSON.parse(body);
        const result = await processRPC(rpcRequest);
        resolve(JSON.stringify(result));
      } catch (error) {
        resolve(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: error.message }, id: null }));
      }
    });
    req.on('error', reject);
  });
}

async function processRPC(rpcRequest) {
  const method = rpcRequest.method;
  const id = rpcRequest.id;

  try {
    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'minimax-mcp', version: '1.0.0' }
        },
        id
      };
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        result: {
          tools: Object.values(tools).map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema
          }))
        },
        id
      };
    }

    if (method === 'tools/call') {
      const toolName = rpcRequest.params.name;
      const args = rpcRequest.params.arguments || {};
      
      if (!tools[toolName]) {
        return {
          jsonrpc: '2.0',
          error: { code: -32601, message: `Tool not found: ${toolName}` },
          id
        };
      }

      const result = await tools[toolName].execute(args);
      return {
        jsonrpc: '2.0',
        result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] },
        id
      };
    }

    return { jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id };
  } catch (error) {
    return { jsonrpc: '2.0', error: { code: -32000, message: error.message }, id };
  }
}

// HTTP server for MCP
const server = http.createServer(async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  if (req.url === '/mcp' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const response = await handleRequest(req);
      res.end(response);
    } catch (e) {
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: e.message }, id: null }));
    }
  } else if (req.url === '/health') {
    res.end('OK');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`MiniMax MCP server running on port ${PORT}`);
});
