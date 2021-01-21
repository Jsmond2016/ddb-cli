# 手写一个 cli

以 vue-cli 为原型作为参考，我们手写一个 cli

## 需求说明

- 实现【人机交互】，按需选择配置
- 实现 【自动下载github模板资源】并且自动安装
- 实现 依赖安装后自动启动模板仓库
- 实现路由配置：即新增一个页面A，则自动在路由配置和页面 tab 中新增这个页面A



## 依赖安装

```bash
$ yarn add commander inquirer download-git-repo ora handlebars figlet clear chalk open watch -D
```

- 依赖说明：
  - [commander](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md) Nodejs 命令配置工具
  - [inquirer](https://github.com/SBoudrias/Inquirer.js#readme) 一组常用的交互式命令行用户界面。
  - [download-git-repo](https://gitlab.com/flippidippi/download-git-repo#readme) 下载 github 资料的工具
  - [ora](https://github.com/sindresorhus/ora#readme) 一个优雅的终端加载器
  - [handlebars](https://handlebarsjs.com/guide/#what-is-handlebars) 一个简单的模板语言
  - [figlet](https://github.com/patorjk/figlet.js#readme) 在终端中打印好看的自定义提示语的工具
  - [clear](https://github.com/bahamas10/node-clear#readme) 终端清屏工具，功能等同 linux 命令 `clear` ，windows 的 `cls`
  - [chalk](https://github.com/chalk/chalk#readme) 类似终端的画笔工具，可以给 log 不同颜色样式的提示语
  - [open](https://github.com/sindresorhus/open#readme) 用于自动打开浏览器
  - [watch](https://github.com/mikeal/watch) 用于监听文件变化

## 初始化

- 新建文件夹： `ddb`
- 进入该文件夹，使用 `npm` 初始化：`npm init -y`
- 新建相关文件：
  - 新建 `/bin/ddb.js`
  - 新建 `/lib/init.js`
  - 新建 `/lib/download.js`
  - 新建 `lib/refresh.js`
- 配置 `package.json`

```json
"name": "ddb",
"bin": {
    "ddb": "./bin/ddb.js"
  },
```

- 绑定软连接：`npm link`， 这里如果报错了，可能是 `"./bin/ddb"` 没有加 `.js` 后缀

到这里，配置部分就完成了，接下来开始编写代码吧

## Hello,World

第一步，我们先写一个 Hello，World

- 在 `/bin/ddb.js` 中编写代码如下

```js
#!/usr/bin/env node
'use strict';

const program = require('commander')

program
    .version('0.0.1')
    .parse(process.argv);
```

- 在终端输入命令：`ddb -V`，是否显示对应的版本号，如果有，则说明前面我们的配置都是成功的

- 编写 `/lib/init.js` 文件如下：

```js
const figlet = promisify(require('figlet'))
const clear = require('clear')


module.exports = async name => {
    clear()
    
    figlet('Hello World!!', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
          }
          console.log(data)
      })
}
```

- 修改 `/bin/ddb.js` 代码

```js
#!/usr/bin/env node
'use strict';


const program = require('commander')

program
    .version('0.0.1')
    .parse(process.argv);


program
  .command("init <name>")
  .description("init project")
  .action(require('../lib/init'))

  program.parse(process.argv)
```

- 测试 ，在终端输入命令 `ddb init test` ，我们可以看到终端输出的很大的 `Hello, world` 字样

## ddb create 

接下来，我们开始编写 `ddb create` 命令

- 开始前，你可能需要了解 inquirer，[点我阅读](https://github.com/SBoudrias/Inquirer.js#readme)
- 准备 `/lib/quesiton.js` 文件

```js
const question = [
  {
       name:'conf',              /* key */
       type:'confirm',           /* 确认 */
       message:'是否创建新的项目？' /* 提示 */
   },{
       name:'name',
       message:'请输入项目名称？',
       when: res => Boolean(res.conf) /* 是否进行 */
   },{
       name:'author',
       message:'请输入作者？',
       when: res => Boolean(res.conf)
   },{
       type: 'list',            /* 选择框 */
       message: '请选择公共管理状态？',
       name: 'state',
       choices: ['mobx','redux'], /* 选项*/
       filter: function(val) {    /* 过滤 */
         return val.toLowerCase()
       },
       when: res => Boolean(res.conf)
   }
]

module.exports = question
```

- 编写 `/bin/init.js` 文件

```js
#!/usr/bin/env node
'use strict';


const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const question = require('../lib/question')

program
    .version('0.0.1')
    .parse(process.argv);

program
  .command("create <name>")
  .description("create a project")
  .action(() => {
    chalk.green("-_- .... 欢迎使用 ddb-cli，轻松构建 vue-cli 应用")
    	// 人机交互，详情见 question 文件
		inquirer.prompt(question).then((answer) => {
			if (answer.conf) {
        	    console.log('answer', answer);
			}
		})
  })

  program.parse(process.argv)
```

- 执行命令进行测试：`ddb create testaa` ，接下来就是进入交互选择配置界面，最后结束会打印出所有配置

> 关于模板文件，有 2 种实现方式，一种是将 template 放在 cli 中，安装时直接 copy 进来，修改部分配置信息；第二种，是将 template 放在远程仓库，每次 创建项目时从远程下载下来，编写部分配置信息即可。这里，我们采用 第二种方案




参考资料：

- [开课吧夏老师-cli代码资料](https://github.com/su37josephxia/kaikeba-cli/blob/master/bin/miku.js)