#!/usr/bin/env python3
"""
MiniMax 工具 CLI
直接通过命令行调用 web_search 和 understand_image
"""

import sys
import json
import os
import base64
import requests
import argparse

API_KEY = "sk-cp-psl1ds15jlmoE3MrgAoyJsypIqxv19Vl9-Cpzoj-N-9SVetFjoOR6db-4FANeiW0bEWqnFZWS8o54tUfz6LomulHUkVOxfO7kpHaWS1idKLflrImn5hcw7U"
API_HOST = "https://api.minimaxi.com"


def process_image_url(image_url: str) -> str:
    """将图片 URL 或本地路径转换为 base64 data URL"""
    if image_url.startswith("@"):
        image_url = image_url[1:]
    
    if image_url.startswith("data:"):
        return image_url
    
    if image_url.startswith(("http://", "https://")):
        try:
            r = requests.get(image_url, timeout=30)
            r.raise_for_status()
            content_type = r.headers.get('content-type', '').lower()
            fmt = 'jpeg'
            if 'png' in content_type:
                fmt = 'png'
            elif 'webp' in content_type:
                fmt = 'webp'
            data = base64.b64encode(r.content).decode('utf-8')
            return f"data:image/{fmt};base64,{data}"
        except Exception as e:
            print(f"Error downloading image: {e}", file=sys.stderr)
            sys.exit(1)
    
    # 本地文件
    if not os.path.exists(image_url):
        print(f"File not found: {image_url}", file=sys.stderr)
        sys.exit(1)
    with open(image_url, "rb") as f:
        data = f.read()
    fmt = 'jpeg'
    if image_url.lower().endswith('.png'):
        fmt = 'png'
    elif image_url.lower().endswith('.webp'):
        fmt = 'webp'
    b64 = base64.b64encode(data).decode('utf-8')
    return f"data:image/{fmt};base64,{b64}"


def web_search(query: str):
    """网络搜索"""
    url = f"{API_HOST}/v1/coding_plan/search"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {"q": query}
    
    r = requests.post(url, headers=headers, json=data, timeout=30)
    result = r.json()
    
    # 格式化输出
    if "organic" in result:
        for i, item in enumerate(result["organic"][:10], 1):
            print(f"{i}. {item.get('title', '')}")
            print(f"   {item.get('snippet', '')[:200]}...")
            print(f"   {item.get('link', '')}")
            print()
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))


def understand_image(prompt: str, image_path: str):
    """图片理解"""
    processed_url = process_image_url(image_path)
    
    url = f"{API_HOST}/v1/coding_plan/vlm"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {"prompt": prompt, "image_url": processed_url}
    
    r = requests.post(url, headers=headers, json=data, timeout=60)
    result = r.json()
    
    if result.get("content"):
        print(result["content"])
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description="MiniMax 工具")
    subparsers = parser.add_subparsers(dest="command", help="子命令")
    
    # web_search 子命令
    search_parser = subparsers.add_parser("search", help="网络搜索")
    search_parser.add_argument("query", help="搜索关键词")
    
    # understand_image 子命令
    img_parser = subparsers.add_parser("image", help="图片理解")
    img_parser.add_argument("image_path", help="图片路径或URL")
    img_parser.add_argument("--prompt", default="描述这个图片", help="分析提示")
    
    args = parser.parse_args()
    
    if args.command == "search":
        web_search(args.query)
    elif args.command == "image":
        understand_image(args.prompt, args.image_path)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
