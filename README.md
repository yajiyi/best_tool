# Best Tool

### 本项目使用 GNU General Public License v3.0 许可证。具体见 `LICENSE` 文件。非授权禁止商用

---

 - 拔萃实验机房最好的工具箱
 - 使用 nodejs + electron 编写
 - Alt + C 可以隐藏/显示程序窗口

---

| 功能               | 支持情况 |
| ------------------ | -------- |
| 结束极域           | ✔        |
| 杀死联想           | ✔        |
| 解除网络/文件限制  | ✔        |
| 启用win键          | ✔        |
| 反截屏(打游戏专用) | ✔        |
| 获取BCSY的常用密码 | ✔        |
<!-- ✘ -->

---

### 运行项目
1. 确保你有 nodejs 和 g++ 环境
2. 安装 electron 框架
```bash
npm install electron --save-dev
```
3. 编译 dll 和 injector
```bash
npm run build:enable
npm run build:disable
npm run build:injector
npm run build:getAffinity
```
4. 运行
```bash
npm run start
```

---

### 打包项目
1. 请先完成 运行项目
2. 安装 electron-builder 打包程序
```bash
npm install electron-builder --save-dev
```
3. 打包
```bash
npm run build
```
4. 二进制文件将生成在 ./dist/BestTool x.x.x