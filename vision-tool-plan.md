# 视觉工具开发方案

## 背景

OpenClaw 当前多模态支持较弱，需要构建一套完整的视觉理解能力。

---

## 方案一：本地 OCR

### 技术选型
- **Tesseract OCR**: 开源免费，本地运行
- **PaddleOCR**: 效果更好，中文支持优秀
- **EasyOCR**: PyTorch 实现，API 友好

### 实现方式
```bash
# PaddleOCR 示例
pip install paddlepaddle paddleocr
paddleocr --image_dir ./screenshot.png --lang ch
```

### 优点
- 纯本地，无需网络
- 隐私安全
- 响应速度快

### 缺点
- 仅限文字识别，无法理解图像内容
- 复杂场景效果有限

---

## 方案二：MiniMax MCP 图像理解

### 服务能力
参考 [MiniMax MCP 图像理解](https://platform.minimaxi.com/docs/coding-plan/mcp-guide#understand-image)，支持：
- 图像内容描述
- 视觉问答
- 图表理解

### 实现方式
1. 申请 MiniMax API Key
2. 配置 MCP Server 调用其 vision 能力
3. 通过 feishu_doc 或其他工具封装

### 优点
- 效果强大，MiniMax 模型本身多模态能力优秀
- 无需本地 GPU
- 云端服务稳定

### 缺点
- 依赖网络
- API 成本
- 需要配置 MCP 集成

---

## 方案三：自建 CLI 视觉伙伴 (重点开发)

### 核心思路
打造一个命令行工具，调用 Qwen2.5-VL 系列模型，让 AI 自己看图并输出文本理解结果。

### 技术架构

```
┌─────────────────────────────────────────┐
│         OpenClaw Agent                  │
│  (发起视觉理解请求)                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│      vision-cli (自建 CLI 工具)          │
│  - 截图/图片路径 → 模型推理 → 文本输出   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│      Qwen2.5-VL (本地/远程)              │
│  - 图像理解 + 文本生成                    │
└─────────────────────────────────────────┘
```

### 功能模块

#### 1. 基础 OCR 功能
```bash
vision-cli ocr --image path/to/image.png
# 输出: 图像中的文字内容
```

#### 2. 图像理解功能
```bash
vision-cli understand --image path/to/image.png --prompt "描述这张图片"
# 输出: 模型对图像的理解
```

#### 3. 屏幕截图理解 (核心)
```bash
# 截取当前屏幕
vision-cli screenshot --understand

# 截取特定区域
vision-cli screenshot --region 100,100,800,600 --understand
```

#### 4. 交互式对话模式
```bash
vision-cli chat --image path/to/image.png
# 进入交互式问答
```

### 模型选择

| 模型 | 参数量 | 本地部署难度 | 效果 | 推荐度 |
|------|--------|--------------|------|--------|
| Qwen2.5-VL-3B | 3B | ⭐⭐ 简单 | 基础可用 | ⭐⭐⭐ |
| Qwen2.5-VL-7B | 7B | ⭐⭐ 中等 | 较好 | ⭐⭐⭐⭐ |
| Qwen2.5-VL-72B | 72B | ⭐ 困难 | 最佳 | ⭐⭐⭐ |

### 依赖安装

```bash
# 安装 Qwen2.5-VL (推荐 7B)
pip install qwen-vl-utils
pip install transformers torch

# 或使用 LMStudio 本地部署
# 下载 LMStudio: https://lmstudio.ai/
```

### 核心代码实现

```python
#!/usr/bin/env python3
"""
vision-cli: 命令行视觉理解工具
"""

import argparse
import subprocess
import sys
from pathlib import Path

def ocr_image(image_path: str) -> str:
    """使用 PaddleOCR 进行文字识别"""
    result = subprocess.run(
        ["paddleocr", "--image_dir", image_path, "--lang", "ch"],
        capture_output=True, text=True
    )
    return result.stdout

def understand_image(image_path: str, prompt: str = "描述这张图片") -> str:
    """调用 Qwen2.5-VL 理解图像"""
    # 方式1: 使用 transformers 本地推理
    from transformers import AutoProcessor, AutoModelForVision2Seq
    from qwen_vl_utils import process_vision_info
    
    processor = AutoProcessor.from_pretrained("Qwen/Qwen2.5-VL-7B-Instruct")
    model = AutoModelForVision2Seq.from_pretrained("Qwen/Qwen2.5-VL-7B-Instruct")
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image", "image": f"file://{image_path}"},
                {"type": "text", "text": prompt}
            ]
        }
    ]
    
    text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    image_inputs, _ = process_vision_info(messages)
    
    inputs = processor(text=[text], images=image_inputs, return_tensors="pt", padding=True)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}
    
    generated_ids = model.generate(**inputs, max_new_tokens=128)
    generated_ids_trimmed = [
        out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs['input_ids'], generated_ids)
    ]
    
    output_text = processor.batch_decode(
        generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=True
    )[0]
    
    return output_text

def capture_screen(region: str = None) -> str:
    """截取屏幕"""
    # 使用 mss 库截屏
    import mss
    import mss.tools
    
    with mss.mss() as sct:
        if region:
            x, y, w, h = map(int, region.split(','))
            monitor = {"top": y, "left": x, "width": w, "height": h}
        else:
            monitor = sct.monitors[1]
        
        screenshot = sct.grab(monitor)
        output_path = "/tmp/vision_cli_screenshot.png"
        mss.tools.to_png(screenshot.rgb, screenshot.size, output=output_path)
        return output_path

def main():
    parser = argparse.ArgumentParser(description="视觉理解 CLI 工具")
    subparsers = parser.add_subparsers(dest="command")
    
    # OCR 命令
    ocr_parser = subparsers.add_parser("ocr", help="文字识别")
    ocr_parser.add_argument("--image", required=True, help="图片路径")
    
    # 理解命令
    understand_parser = subparsers.add_parser("understand", help="图像理解")
    understand_parser.add_argument("--image", required=True, help="图片路径")
    understand_parser.add_argument("--prompt", default="描述这张图片", help="提问内容")
    
    # 截图命令
    screenshot_parser = subparsers.add_parser("screenshot", help="截屏并理解")
    screenshot_parser.add_argument("--region", help="区域: x,y,w,h")
    screenshot_parser.add_argument("--understand", action="store_true", help="是否理解截图")
    
    args = parser.parse_args()
    
    if args.command == "ocr":
        print(ocr_image(args.image))
    elif args.command == "understand":
        print(understand_image(args.image, args.prompt))
    elif args.command == "screenshot":
        img_path = capture_screen(args.region)
        if args.understand:
            print(understand_image(img_path))
        else:
            print(f"截图已保存: {img_path}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
```

### OpenClaw 集成方式

在 TOOLS.md 中添加：

```markdown
### 视觉工具

- **vision-cli**: 自建 CLI 工具
  - 路径: `~/vision-cli/vision_cli.py`
  - 功能: OCR / 图像理解 / 截图理解
  - 使用:
    ```bash
    python ~/vision-cli/vision_cli.py screenshot --understand
    python ~/vision-cli/vision_cli.py understand --image path/to/img.png --prompt "描述内容"
    ```
```

通过 exec 工具调用：

```python
# 在 OpenClaw 中使用
exec(command="python ~/vision-cli/vision_cli.py screenshot --understand")
```

---

## 开发优先级

| 优先级 | 任务 | 预计时间 | 状态 |
|--------|------|----------|------|
| P0 | 本地 OCR (PaddleOCR) 快速可用 | 1h | ✅ 完成 |
| P1 | 方案二: MiniMax MCP 配置测试 | 2h | 待处理 |
| P2 | 方案三: Qwen2.5-VL CLI 工具开发 | 4-8h | 待处理 |

---

## 方案一: 本地 OCR - 已完成

### 文件位置
- 代码: `C:\vision-cli\ocr.py` (Windows)
- 源码: `~/.openclaw/workspace/vision-cli/ocr.py`

### 安装依赖 (Windows)
```bash
pip install paddlepaddle paddleocr -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 使用方法
```bash
python C:\vision-cli\ocr.py --image path/to/image.png
python C:\vision-cli\ocr.py --image path/to/image.png --lang en
python C:\vision-cli\ocr.py --image path/to/image.png --output result.txt
```

### OpenClaw 集成
```python
# 通过 exec 调用
exec(command='cmd.exe /c "python C:\\vision-cli\\ocr.py --image C:\\path\\to\\img.png"')
```

---

## 待补充

- [x] PaddleOCR 安装 (Windows Python 313)
- [ ] 方案二: MiniMax API Key 申请
- [ ] 方案三: Qwen2.5-VL 模型下载/配置
