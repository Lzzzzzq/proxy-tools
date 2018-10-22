## Proxy-tools

本插件通过中间人代理的方式实现线上资源代理的功能，并提供了可视化操作界面。

### 前置条件

需本机装有代理工具，这里推荐 chrome 插件，[switchyomega](https://www.switchyomega.com/)

添加配置如下

![](http://i.thsi.cn/webprivate/zttz/omega.jpg)

### 安装

```shell
git clone https://github.com/Lzzzzzq/proxy-tools.git

cd proxy-tools

cnpm i
```

### 使用

```shell
node app.js
```

如找到了本机安装的 chrome 浏览器，则会自动打开对应的可视化界面，如未自动打开页面，请手动打开[http://localhost:3000/view#/](http://localhost:3000/view#/)

