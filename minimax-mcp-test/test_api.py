#!/usr/bin/env python3
"""
直接调用 MiniMax API 测试 Web Search 功能
不通过 MCP，自己做 client
"""

import requests
import json

API_KEY = "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U"
API_HOST = "https://api.minimaxi.com"

def test_web_search_api(query: str = "Python MCP server"):
    """直接调用 MiniMax Web Search API"""
    print(f"\n🔍 测试 Web Search API: {query}")
    print("-" * 50)
    
    url = f"{API_HOST}/v1/search"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "default",
        "query": query
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求失败: {e}")

def test_web_scan_api(query: str = "latest AI news"):
    """尝试 Web Scan API"""
    print(f"\n🌐 测试 Web Scan API: {query}")
    print("-" * 50)
    
    url = f"{API_HOST}/v1/web_scan"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "query": query
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求失败: {e}")

def list_api_endpoints():
    """列出所有可能的 API 端点"""
    print("\n📡 尝试列出可用 API 端点...")
    print("-" * 50)
    
    base_urls = [
        f"{API_HOST}/v1/search",
        f"{API_HOST}/v1/web_search", 
        f"{API_HOST}/v1/web_scan",
        f"{API_HOST}/v1/text/chatcompletion_v2",
        f"{API_HOST}/v1/grounding",
    ]
    
    for url in base_urls:
        try:
            # 只发 HEAD 请求看是否404
            response = requests.head(url, 
                headers={"Authorization": f"Bearer {API_KEY}"}, 
                timeout=5)
            print(f"  {url}: {response.status_code}")
        except Exception as e:
            print(f"  {url}: ❌ {e}")

def test_chat_api():
    """测试 Chat API 是否可用（验证 API Key 有效性）"""
    print(f"\n💬 测试 Chat API (验证 Key 有效性)")
    print("-" * 50)
    
    url = f"{API_HOST}/v1/text/chatcompletion_v2"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "abab6.5s-chat",
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ API Key 有效")
        else:
            print(f"Response: {response.text[:500]}")
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求失败: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("MiniMax API 测试")
    print("=" * 60)
    
    # 1. 先验证 API Key 是否有效
    test_chat_api()
    
    # 2. 尝试不同的搜索 API
    test_web_search_api("Python")
    test_web_scan_api("Python")
    
    # 3. 列出端点
    list_api_endpoints()
