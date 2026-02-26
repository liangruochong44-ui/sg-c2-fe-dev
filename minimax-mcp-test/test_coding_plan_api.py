#!/usr/bin/env python3
"""
直接调用 MiniMax Coding Plan API 测试
绕过 MCP 协议，直接测试 web_search 和 understand_image
"""

import requests
import json
import os
import sys

API_KEY = os.environ.get("MINIMAX_API_KEY", "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U")
API_HOST = os.environ.get("MINIMAX_API_HOST", "https://api.minimaxi.com")

def test_web_search(query: str = "Python latest version 2026"):
    """测试 web_search API"""
    print(f"\n🔍 测试 web_search: {query}")
    print("-" * 50)
    
    url = f"{API_HOST}/v1/coding_plan/search"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {"q": query}
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 成功!")
            print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])
        else:
            print(f"❌ 失败: {response.text[:500]}")
    except Exception as e:
        print(f"❌ 异常: {e}")

def test_understand_image(prompt: str = "描述这个图片", image_url: str = "https://httpbin.org/image/png"):
    """测试 understand_image API"""
    print(f"\n🖼️ 测试 understand_image")
    print(f"Prompt: {prompt}")
    print(f"Image: {image_url}")
    print("-" * 50)
    
    url = f"{API_HOST}/v1/coding_plan/vlm"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "prompt": prompt,
        "image_url": image_url
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 成功!")
            print(json.dumps(result, indent=2, ensure_ascii=False)[:2000])
        else:
            print(f"❌ 失败: {response.text[:500]}")
    except Exception as e:
        print(f"❌ 异常: {e}")

def main():
    print("=" * 60)
    print("MiniMax Coding Plan API 测试")
    print(f"API Host: {API_HOST}")
    print("=" * 60)
    
    # 测试 web_search
    test_web_search("latest AI news February 2026")
    
    # 测试 understand_image
    test_understand_image()

if __name__ == "__main__":
    main()
