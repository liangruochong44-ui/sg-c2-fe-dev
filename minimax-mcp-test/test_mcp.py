#!/usr/bin/env python3
"""
MiniMax MCP Web Search 测试脚本
直接调用 MiniMax Coding Plan MCP，不经过 OpenClaw
"""

import os
import json
import subprocess

# API Key (从 openclaw.json 提取)
API_KEY = "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U"
API_HOST = "https://api.minimaxi.com"

def test_web_search(query: str = "Python MCP server example"):
    """测试 web_search 工具"""
    print(f"\n🔍 测试 web_search: {query}")
    print("-" * 50)
    
    env = os.environ.copy()
    env["MINIMAX_API_KEY"] = API_KEY
    env["MINIMAX_API_HOST"] = API_HOST
    
    # 使用 uvx 运行 minimax-coding-plan-mcp
    cmd = [
        "uvx", "minimax-coding-plan-mcp", "-y",
        "--web-search", query
    ]
    
    try:
        result = subprocess.run(
            cmd,
            env=env,
            capture_output=True,
            text=True,
            timeout=30
        )
        print(f"返回码: {result.returncode}")
        print(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            print(f"STDERR:\n{result.stderr}")
    except subprocess.TimeoutExpired:
        print("❌ 超时")
    except Exception as e:
        print(f"❌ 错误: {e}")

def test_understand_image(prompt: str, image_url: str):
    """测试 understand_image 工具"""
    print(f"\n🖼️ 测试 understand_image")
    print(f"Prompt: {prompt}")
    print(f"Image: {image_url}")
    print("-" * 50)
    
    env = os.environ.copy()
    env["MINIMAX_API_KEY"] = API_KEY
    env["MINIMAX_API_HOST"] = API_HOST
    
    # 使用 uvx 运行 minimax-coding-plan-mcp
    cmd = [
        "uvx", "minimax-coding-plan-mcp", "-y",
        "--understand-image", prompt, image_url
    ]
    
    try:
        result = subprocess.run(
            cmd,
            env=env,
            capture_output=True,
            text=True,
            timeout=60
        )
        print(f"返回码: {result.returncode}")
        print(f"STDOUT:\n{result.stdout}")
        if result.stderr:
            print(f"STDERR:\n{result.stderr}")
    except subprocess.TimeoutExpired:
        print("❌ 超时")
    except Exception as e:
        print(f"❌ 错误: {e}")

def main():
    print("=" * 60)
    print("MiniMax MCP Web Search 测试")
    print("=" * 60)
    
    # 测试 web_search
    test_web_search("latest AI news 2026")
    
    # 可选：测试 understand_image
    # test_understand_image("What is in this image?", "https://example.com/image.jpg")

if __name__ == "__main__":
    main()
