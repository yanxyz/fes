# fes-cli

## 安装

```sh
yarn
npm link
fes
```

为了在后台长期运行 fes server, 使用 PM2

```sh
npm install -g pm2
fes create-config # create fes.config.js
fes start
```

fes.config.js 是 PM2 的配置文件。fes cli 需要读取这个文件，主要是为了读取 port。

## 使用

```sh
fes a.js # 单个脚本
fes a.js b.js # 多个脚本
```

### Jasmine

[下载 Jasmine](https://github.com/jasmine/jasmine/releases)，解压到 `/server/public/lib`，注意修改模板 `/server/views/jasmine.ejs` 当中的路径。

```sh
fes a.spec.js # 名字以 .spec.js 为后缀
```
