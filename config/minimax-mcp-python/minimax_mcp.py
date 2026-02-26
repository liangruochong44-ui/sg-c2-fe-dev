#!/usr/bin/env python3
"""
MiniMax Coding Plan MCP Server
直接调用 MiniMax API 提供 web_search 和 understand_image 工具
"""

import sys
import json
import os
import base64
import requests

# API 配置
API_KEY = os.environ.get("MINIMAX_API_KEY", "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U")
API_HOST = os.environ.get("MINIMAX_API_HOST", "https://api.minimaxi.com")


def process_image_url(image_url: str) -> str:
    """将图片 URL 或本地路径转换为 base64 data URL"""
    import requests as req
    
    # 移除 @ 前缀
    if image_url.startswith("@"):
        image_url = image_url[1:]
    
    # 已经是 data URL
    if image_url.startswith("data:"):
        return image_url
    
    # HTTP URL
    if image_url.startswith(("http://", "https://")):
        try:
            r = req.get(image_url, timeout=30)
            r.raise_for_status()
            content_type = r.headers.get('content-type', '').lower()
            if 'jpeg' in content_type or 'jpg' in content_type:
                fmt = 'jpeg'
            elif 'png' in content_type:
                fmt = 'png'
            elif 'webp' in content_type:
                fmt = 'webp'
            else:
                fmt = 'jpeg'
            data = base64.b64encode(r.content).decode('utf-8')
            return f"data:image/{fmt};base64,{data}"
        except Exception as e:
            raise Exception(f"Failed to download image: {e}")
    
    # 本地文件
    else:
        if not os.path.exists(image_url):
            raise Exception(f"File not found: {image_url}")
        with open(image_url, "rb") as f:
            data = f.read()
        fmt = 'jpeg'
        if image_url.lower().endswith('.png'):
            fmt = 'png'
        elif image_url.lower().endswith('.webp'):
            fmt = 'webp'
        b64 = base64.b64encode(data).decode('utf-8')
        return f"data:image/{fmt};base64,{b64}"


def handle_tool(tool_name: str, arguments: dict) -> dict:
    """处理工具调用"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    if tool_name == "web_search":
        query = arguments.get("q") or arguments.get("query", "")
        url = f"{API_HOST}/v1/coding_plan/search"
        data = {"q": query}
        r = requests.post(url, headers=headers, json=data, timeout=30)
        return {"content": [{"type": "text", "text": json.dumps(r.json(), ensure_ascii=False, indent=2)}]}
    
    elif tool_name == "understand_image":
        prompt = arguments.get("prompt", "")
        image_source = arguments.get("image_source") or arguments.get("image_url", "")
        
        # 处理图片
        processed_url = process_image_url(image_source)
        
        url = f"{API_HOST}/v1/coding_plan/vlm"
        data = {"prompt": prompt, "image_url": processed_url}
        r = requests.post(url, headers=headers, json=data, timeout=60)
        result = r.json()
        
        if result.get("content"):
            return {"content": [{"type": "text", "text": result["content"]}]}
        else:
            return {"content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}]}
    
    else:
        raise Exception(f"Unknown tool: {tool_name}")


def main():
    """MCP stdio server 主循环"""
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        
        try:
            request = json.loads(line)
            method = request.get("method")
            params = request.get("params", {})
            request_id = request.get("id")
            
            if method == "initialize":
                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {"tools": {}},
                        "serverInfo": {"name": "minimax-mcp", "version": "1.0.0"}
                    }
                }
                print(json.dumps(response), flush=True)
            
            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": {
                        "tools": [
                            {
                                "name": "web_search",
                                "description": "网络搜索，返回搜索结果",
                                "inputSchema": {"type": "object", "properties": {"q": {"type": "string", "description": "搜索查询"}}, "required": ["q"]}
                            },
                            {
                                "name": "understand_image",
                                "description": "图片理解，分析图片内容",
                                "inputSchema": {"type": "object", "properties": {"prompt": {"type": "string"}, "image_source": {"type": "string"}}, "required": ["prompt", "image_source"]}
                            }
                        ]
                    }
                }
                print(json.dumps(response), flush=True)
            
            elif method == "tools/call":
                tool_name = params.get("name")
                arguments = params.get("arguments", {})
                result = handle_tool(tool_name, arguments)
                response = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": result
                }
                print(json.dumps(response), flush=True)
            
        except Exception as e:
            error_response = {
                "jsonrpc": "2.0",
                "id": request_id if 'request_id' in locals() else None,
                "error": {"code": -32603, "message": str(e)}
            }
            print(json.dumps(error_response), flush=True)


if __name__ == "__main__":
    main()
