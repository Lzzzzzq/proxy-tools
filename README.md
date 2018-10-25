## Proxy-tools

本插件通过中间人代理的方式实现线上资源代理的功能，并提供了可视化操作界面。

### 安装

```shell
npm i -g local-proxy-tools
```

### 使用

```javascript
proxy-tools
// or
pt
```

### 前置条件

需本机装有代理工具，这里推荐 chrome 插件，[switchyomega](https://www.switchyomega.com/)

添加配置如下

![](http://i.thsi.cn/webprivate/zttz/omega.jpg)

默认端口为 3000，如被占用，则会自动切换到其他端口开启服务，具体 switchyomega 中要配置的端口号请根据命令行中，服务给出的提示信息进行设置。
