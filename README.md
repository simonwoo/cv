## 安装
使用以下命令安装相关的npm和bower包:
```
npm install
bower install
```

## 主要gulp任务
- gulp serve/gulp: 开发时环境(在本地3000启动一个静态服务器, 当相关文件改变时实时更新页面)
- gulp build: 构建线上相关文件到docs目录, 供github pages使用

PS: 具体任务请参考gulpfile.js文件

## 开发及发布流程
local develop -> local test -> gulp build -> git commit and push

## 线上demo
[DEMO](https://simonwoo.github.io/cv/)

## 设计思路
[设计思路](https://segmentfault.com/a/1190000007399804)


