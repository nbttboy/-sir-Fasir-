# 发票sir - 智能发票审核终端

**发票sir** 是一款基于 AI 视觉大模型的智能财税风控应用。支持发票全要素自动提取、国税局真伪模拟查验、企业合规性风控及批量连号/拆单分析。

## 核心功能

1.  **AI OCR 与 智能分析**: 自动提取发票代码、号码、金额、日期等关键要素。
2.  **国税局模拟查验**: 模拟登录 `inv-veri.chinatax.gov.cn` 进行发票真伪查验。
3.  **批量风控**:
    *   **连号预警**: 识别多张发票号码连续的异常情况（疑似拆单）。
    *   **金额合规**: 自定义单张及批量报销金额上限预警。
4.  **本地大模型支持**: 兼容 Ollama、LM Studio，保障数据隐私。
5.  **实时拍照**: 桌面/移动端均支持调用摄像头实时拍摄发票进行审核。

## 部署与安装

### 1. 网页版直接使用
本项目为纯前端 React 应用，任何静态服务器（如 Nginx, Vercel, Netlify）均可部署。
将构建产物上传至服务器根目录即可。

### 2. 手机端使用
支持 PWA 标准，在 Safari (iOS) 或 Chrome (Android) 中点击 "添加到主屏幕" 即可像原生 App 一样使用。

## 本地大模型配置指南 (Privacy & Local LLM)

为了保护财务数据隐私，您可以配置本地大模型。

**前提条件**: 本地模型必须具备 **视觉 (Vision)** 能力 (如 `llava`, `llama-3.2-vision`)，否则无法识别发票图片。

### Ollama 配置
1. 下载并安装 [Ollama](https://ollama.com/)。
2. 拉取视觉模型: `ollama run llava`。
3. 启动服务 (默认端口 11434)。
   *注意: 需配置 CORS 允许浏览器访问，设置环境变量 `OLLAMA_ORIGINS="*"`*。
4. 在本应用 "配置" -> "AI 服务商" 选择 "Custom / Local"。
   - Base URL: `http://localhost:11434/v1`
   - Model Name: `llava`
   - API Key: `ollama` (任意填写)

### LM Studio 配置
1. 下载 [LM Studio](https://lmstudio.ai/)。
2. 搜索并下载视觉模型 (如 `Qwen-VL-Chat` 或 `Llava`)。
3. 开启 Local Server。
4. 在本应用配置:
   - Base URL: `http://localhost:1234/v1`
   - Model Name: `local-model` (或具体加载的模型名)

## 敏感权限说明
- **摄像头**: 用于手机/电脑端拍摄发票。
- **网络**: 用于连接 AI 模型接口及模拟国税局查验。