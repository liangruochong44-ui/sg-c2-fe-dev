#!/usr/bin/env python3
"""
MiniMax 图片理解工具
用法: python3 minimax_vision.py <image_path> "<prompt>"
"""

import os
import sys
import base64
import requests
import json

API_KEY = "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U"
API_HOST = "https://api.minimaxi.com"

def encode_image(image_path):
    """将图片转为 base64"""
    with open(image_path, 'rb') as f:
        return base64.b64encode(f.read()).decode()

def understand_image(image_path, prompt="描述这张图片"):
    """调用 MiniMax API 理解图片"""
    
    # 判断是URL还是本地文件
    if image_path.startswith('http://') or image_path.startswith('https://'):
        image_url = image_path
    else:
        # 本地文件转 base64
        b64 = encode_image(image_path)
        ext = os.path.splitext(image_path)[1].lower()
        mime_type = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg', 
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }.get(ext, 'image/jpeg')
        image_url = f"data:{mime_type};base64,{b64}"
    
    url = f"{API_HOST}/v1/text/chatcompletion_v2"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    messages = [{
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": image_url}}
        ]
    }]
    
    # 尝试多个模型
    models = ["MiniMax-M2.1", "MiniMax-M2.5", "abab6.5s-chat"]
    
    for model in models:
        try:
            data = {
                "model": model,
                "messages": messages,
                "max_tokens": 500
            }
            r = requests.post(url, headers=headers, json=data, timeout=30)
            result = r.json()
            
            if result.get("choices") and result["choices"][0].get("message"):
                return result["choices"][0]["message"].get("content", "")
            elif result.get("base_resp", {}).get("status_code") == 0:
                # 成功但无内容
                return "图片理解成功，但未返回内容"
            else:
                print(f"Model {model} failed: {result}", file=sys.stderr)
                continue
        except Exception as e:
            print(f"Error with {model}: {e}", file=sys.stderr)
            continue
    
    return "所有模型都失败了"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python3 minimax_vision.py <image_path> [prompt]", file=sys.stderr)
        sys.exit(1)
    
    image_path = sys.argv[1]
    prompt = sys.argv[2] if len(sys.argv) > 2 else "描述这张图片"
    
    result = understand_image(image_path, prompt)
    print(result)
