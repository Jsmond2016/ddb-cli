

本工程参考来源：[「前端工程化」从0-1搭建react，ts脚手架（1.2w字超详细教程）](https://juejin.cn/post/6919308174151385096#heading-20)

使用方式：

- 下载本项目
- 阅读上面的博客链接
- 进入 bin 目录，执行 `sudo npm link cli-demo`
- 随便进入一个新的空文件夹，测试 `cli-demo -V` 测试是否有结果输出


当前 cli 支持 3 种命令：

- cli-demo create 创建项目，基于 template 模板创建
- cli-demo start
- cli-demo build


使用工具：

> 参考： [从 1 到完美，用 node 写一个命令行工具](https://segmentfault.com/a/1190000016555129)

- minimist: 解析命令行的参数
- chalk: 让命令行的字符带上颜色
- Inquirer.js: 让命令行与用户进行交互，如输入、选择等
- shelljs: 跨平台 Unix shell 命令 的 node 封装
- prompts: 又一个让命令行与用户进行交互的工具
- ora: 命令行加载中图标
- progress: 命令行进度条


参考资料：

- [从 1 到完美，用 node 写一个命令行工具](https://segmentfault.com/a/1190000016555129)
- [【前端工程化基础 - CLI 篇】Vue CLI 是如何实现的](https://juejin.cn/post/6916303253487484942#heading-14)
- [【前端工程化基础 - CLI 篇】Creact React App 是如何实现的](https://juejin.cn/post/6910839646000054280)
- [从0到1整合一个自己的cli工具](https://zhuanlan.zhihu.com/p/157298272)，代码为：[github.com/howieyi/water](https://github.com/howieyi/water)