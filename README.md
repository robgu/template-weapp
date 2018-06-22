# 1号群

## Contributing

- 安装 eslint 依赖

```sh
npm install
```

- 添加 commit 检查

```sh
npm run link-files
```

- 在微信开发工具中选择 `src` 路径

- 使用 vscode 开发

## 部署

- 在 ~/.zshrc 中加入

```bash
  export WECHAT_CLI=/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin
  export PATH=$WECHAT_CLI:$PATH
```

- npm install
- 提交代码

```sh
./scripts/deploy
```

- 到 https://mp.weixin.qq.com/ 提交审核

## Code Style

> data
- 属性在前, i18n text 在后
- i18n text 以 xxxText 形式命名

> function
- 排序 `生命周期` > `on{Action}{Entity}` >  `其他方法`
- 事件回调命名用 `on{Action}{Entity}`
