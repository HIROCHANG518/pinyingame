# 轩瑞的拼音魔法工坊

一个面向小学生的拼音拼读互动学习工具。通过选择声母、韵母和声调来拼写汉字，帮助孩子掌握汉语拼音。

## 在线体验

| 站点 | 地址 |
|------|------|
| 拼音游戏 | https://pinyin.9i9i9i9i.com |

## 功能特性

### 核心玩法
- **声母 + 韵母 + 声调**：三步骤拼写汉字，每步独立判断
- **即时反馈**：选对声母/韵母立即显示 ✅ 对勾；选错有语音提示
- **5 组音调按键**：ˉ ˊ ˇ ˋ + 轻声，直观的声调符号
- **语音朗读**：预录制 200+ MP3 音频，涵盖所有声母、韵母、字词读音

### 学习机制
- **20 题一组**：循序渐进，避免疲劳
- **「我再听听」**：没听清可随时重新播放
- **「看答案」**：实在不会可以查看正确答案并学习
- **「再来练习」**：自动收集错题，针对性复习
- **自定义字卡**：家长/老师可手动设计题目

### 界面设计
- **自然清新风配色**：柔绿渐变背景 + 奶油白卡片，护眼舒适
- **楷体字**：主要文字使用 Kaiti SC（楷体），比黑体更柔和流畅
- **站酷快乐体标题**：ZCOOL KuaiLe 圆润字体，适合儿童
- **响应式布局**：适配桌面和平板

## 技术架构

```
pinyingame/
├── index.html          # 主页面（单页应用）
├── app.js              # 核心游戏逻辑（~500 行）
├── styles.css           # 样式（~15 处改动记录）
├── common-chars.js      # 常用汉字数据（100KB）
├── audio-manifest.js    # 音频文件清单
├── audio/               # 200+ MP3 音频文件（~2MB）
│   ├── initial_*.mp3     # 声母发音
│   ├── final_*.mp3       # 韵母发音
│   ├── word_*.mp3        # 字词发音
│   └── phrase_*.mp3      # 反馈语音（真棒/再想想等）
├── data/
│   └── words.json        # 字库数据源
├── tools/
│   └── build_common_chars.mjs  # 构建字符数据
└── 使用说明.md
```

### 数据流
1. `words[]` 数组存储 100 组声母/韵母/声调/汉字组合
2. `fuzhouWords[]` 额外提供福州人易混音专项练习
3. `common-chars.js` 预编译 3000+ 常用汉字映射，供自定义字卡使用
4. 用户进度存储于 `localStorage`

## 部署方案

| 组件 | 配置 |
|------|------|
| 静态托管 | 阿里云 OSS 香港节点 `pinyingame-hk` |
| OSS 路径 | `pinyingame/` |
| 反向代理 | Cloudflare Worker `pinyin-proxy` |
| 自定义域名 | `pinyin.9i9i9i9i.com` |
| SSL | Cloudflare 自动提供 |

### 部署命令

```bash
# 上传到 OSS
pip3 install oss2
python3 upload_to_oss.py

# Cloudflare Worker 代码片段
const ossUrl = `http://pinyingame-hk.oss-cn-hongkong.aliyuncs.com/pinyingame${url.pathname}`;
```

## 开发

### 本地运行

```bash
cd /Users/xinzhang/Documents/pinyingame
python3 -m http.server 8090
# 打开 http://localhost:8090
```

### 最近改动（2026-06-10）

1. **声母/韵母对勾标志** — 选对即时显示 ✅，独立判断不再等待
2. **声调按键** — 滑块改为 5 个音标按键（· ˉ ˊ ˇ ˋ）
3. **题号 + 下一组导航** — 左侧显示当前进度，右侧「下一组」按钮
4. **✅ 标识位优化** — 每个 piece 上方独立显示，空间更宽不遮挡
5. **拼音结果位置下移** — 避免与声母韵母区域重叠
6. **配色重构** — 自然清新风：柔绿背景 + 森林绿主题色
7. **字体替换** — 楷体（Kaiti SC）+ 站酷快乐体（ZCOOL KuaiLe）

## 作者

为轩瑞小朋友定制开发的拼音学习工具。

## License

Private — All rights reserved.
