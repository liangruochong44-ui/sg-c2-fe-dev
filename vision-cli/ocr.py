#!/usr/bin/env python3
"""
本地 OCR CLI 工具
使用 PaddleOCR 进行文字识别

用法:
    python ocr.py --image path/to/image.png
    python ocr.py --image path/to/image.png --lang ch
    python ocr.py --image path/to/image.png --output result.txt
"""

import argparse
import sys
from pathlib import Path

def install_dependencies():
    """检查并提示安装依赖"""
    print("正在检查依赖...")
    try:
        from paddleocr import PaddleOCR
        return True
    except ImportError:
        print("错误: 未找到 PaddleOCR")
        print("\n请先安装依赖:")
        print("  pip install paddlepaddle paddleocr")
        print("\n或使用国内镜像:")
        print("  pip install paddlepaddle paddleocr -i https://mirror.baidu.com/pypi/simple")
        return False

def ocr_image(image_path: str, lang: str = 'ch', output: str = None):
    """识别图片中的文字
    
    Args:
        image_path: 图片路径
        lang: 语言, 'ch' 中文, 'en' 英文, 'ch_sim' 简体中文
        output: 输出文件路径 (可选)
    """
    from paddleocr import PaddleOCR
    
    print(f"正在识别图片: {image_path}")
    print(f"语言设置: {lang}")
    
    # 初始化 OCR 引擎
    ocr = PaddleOCR(use_angle_cls=True, lang=lang, show_log=False)
    
    # 执行识别
    result = ocr.ocr(image_path, cls=True)
    
    if not result or not result[0]:
        print("未识别到文字")
        return None
    
    # 提取文字
    text_lines = []
    for line in result[0]:
        if line and len(line) >= 2:
            text = line[1][0]  # 识别到的文字
            confidence = line[1][1]  # 置信度
            text_lines.append(f"{text} (置信度: {confidence:.2f})")
    
    output_text = '\n'.join(text_lines)
    
    # 输出结果
    print(f"\n识别结果 ({len(text_lines)} 行):")
    print("-" * 40)
    print(output_text)
    print("-" * 40)
    
    # 保存到文件
    if output:
        with open(output, 'w', encoding='utf-8') as f:
            f.write(output_text)
        print(f"结果已保存到: {output}")
    
    return output_text

def main():
    parser = argparse.ArgumentParser(
        description='本地 OCR 文字识别工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument('--image', '-i', required=True, help='图片路径')
    parser.add_argument('--lang', '-l', default='ch', 
                        choices=['ch', 'ch_sim', 'en', 'ja', 'ko'],
                        help='语言: ch=中文+英文, ch_sim=简体中文, en=英文, ja=日文, ko=韩文 (默认: ch)')
    parser.add_argument('--output', '-o', help='输出文件路径 (可选)')
    
    args = parser.parse_args()
    
    # 检查图片文件
    if not Path(args.image).exists():
        print(f"错误: 图片文件不存在: {args.image}")
        sys.exit(1)
    
    # 检查并安装依赖
    if not install_dependencies():
        sys.exit(1)
    
    # 执行识别
    try:
        ocr_image(args.image, args.lang, args.output)
    except Exception as e:
        print(f"错误: 识别失败 - {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
