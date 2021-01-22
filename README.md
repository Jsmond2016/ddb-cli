# 手写一个 cli

以 vue-cli 为原型作为参考，我们手写一个 cli

## 需求说明

- 实现【人机交互】，按需选择配置
- 实现 【自动下载github模板资源】并且自动安装
- 实现 依赖安装后自动启动模板仓库
- 实现约定式路由：即新增一个页面A，则自动在路由配置和页面 tab 中新增这个页面A



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

- 接下来，我们开始编写 `create` 方法，它主要包括以下几个功能
  - 下载 选中的 模板信息
  - ~~编辑 模板信息的 文件，如 `package.json`~~
  - 为该模板安装依赖
  - 安装依赖后自动打开浏览器预览

- 下载 选中的模板信息，编写 `/lib/download.js` 文件

```js
module.exports.clone = async function (repo, desc) {
  const { promisify } = require('util')
  const download = promisify(require('download-git-repo')); 
  const ora = require('ora')
  const process = ora(`正在下载...${repo}`)
  process.start()
  await download(repo, desc)
  process.succeed()
}
```

- 修改 `/lib/create.js` 文件

```js

const { clone: download } = require('./download')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))

module.exports = async function (answer = {}) {
    
  if (!Object.keys(answer)) return

  const { name = 'test', author = 'Tom', template = 'vue-template'} = answer
  const templateMap = {
    'vue-template': 'github:su37josephxia/vue-template',
    'react-template': 'github:https:NLRX-WJC/react-antd-admin-template'
  }
  const downloadUrl = templateMap[template]

  log(`创建项目： ${name}`)
  await download(downloadUrl, name)
}

```

- 接下来，就是对已经下载的文件 template 进行依赖安装，依然是编辑 `/lib/create.js` 

```js

const { clone: download } = require('./download')
const chalk = require('chalk')

const log = content => console.log(chalk.green(content))

module.exports = async function (answer = {}) {
  if (!Object.keys(answer)) return
  const { name = 'test', author = 'Tom', template = 'vue-template'} = answer
  const templateMap = {
    'vue-template': 'github:su37josephxia/vue-template',
    'react-template': 'github:https:NLRX-WJC/react-antd-admin-template'
  }
  const downloadUrl = templateMap[template]

  log(`创建项目： ${name}`)
  await download(downloadUrl, name)
  InstallDev(name)
}


// 开启子进程进行依赖安装
const spawn = async (...args) => {
  const { spawn } = require('child_process')
  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', () => {
      resolve()
    })
  })
}

const InstallDev = async (name) => {
  // 自动安装依赖- 使用子进程的方式去执行
  log('=====安装依赖=====')
  await spawn('yarn', ['install'], { cwd: `./${name}`})

  log(`
  
  =====安装完成=====

  =====启动方式=====
  
  cd ${name}

  npm run serve

  or

  yarn serve
  
  
  `)
```

- 测试，执行 `ddb create` ，我们发现，下载完成 template 后，自动进入文件夹中进行依赖安装
- 接下来，我们实现 自动打开浏览器和 启动项目，编辑 `/lib/create.js`

```js
const open = require('open')

// ...
const openAndStart = async (name) => {
  // 自动打开浏览器
  open('http://localhost:8080')

  // 启动
  await spawn('yarn', ['serve'], { cwd: `./${name}`} )
}
```

至此，我们就已经实现了上面的需求啦，接下来，我们来实现路由约定式路由配置



## 约定式路由配置

在 vue 开发过程中，我们有一个操作是必定会重复的，我们可以使用 命令的方式来实现：

- 新增一个页面
- 配置路由信息
- 其他页面添加这个新页面

我们以一个简单的 例子来看

- 新建 `/lib/refresh.js` ，代码为：

```js
const fs = require('fs')
// 用于模板编译
const handlebars = require('handlebars')

module.exports = async () => {
  // 获取列表
  const list = fs.readdirSync('/src/views')
            .filter(v => v !== 'Home.vue')
            .map(item => ({
              name: item.replace('.vue', '').toLowerCase(),
              file: item
            }))
  // 生成路由定义
  compile({list}, '/router.js', '/template/router.js.hbs')

  // 生成菜单
  compile({list}, '/src/App.vue', '/template/App.vue.hbs')

  /**
   * 模板编译
   * @param {*} meta 数据定义
   * @param {*} filePath 目标文件
   * @param {*} templatePath 模板文件
   */
  function compile(meta, filePath, templatePath) {
    if (fs.existsSync(templatePath)) {
      const content = fs.readFileSync(templatePath).toString()
      const result = handlebars.compile(content)(meta)
      fs.writeFileSync(filePath, result)
      console.log(`${filePath} 创建成功`)
    }
  }

}
```

- 在 `/lib/create.js` 加入

```js
program
  .command("refresh")
  .description("refresh routers and menu")
  .action(require('../lib/refresh'))
```

- 测试：

  - 在 `模板文件/src/views/` 目录下新建 `Test.vue` ，内容为

  ```js
  <template>
    <div class="test">
      <h1>This is an Test page</h1>
    </div>
  </template>
  ```

  - 执行 `ddb refresh` 后，即可看到成功提示，查看 `模板文件/src/routers.js` 和 `模板文件/src/App.vue` ，即可看到新增的 `Test` 相关路由和 tab
  - 界面 `localhost:8080` 也可以看到对应的效果



到这里，手写 cli 就完成啦

## 总结

- 我们主要使用 `commander` 定义 nodejs 终端命令，然后使用 `inquirer` 实现 和命令界面交互
- 接着使用美化工具 `figlet` 写 ASCII 风格的 欢迎界面 字段，使用 `chalk` 工具美化命令提示
- 然后使用 `promisify` 包装异步操作返回 promise，使用  `download-git-repo` 进行代码下载
- 使用  nodejs 自带的 `child_process` 子进程去执行安装依赖任务，使用 `open` 打开我们的模板项目
- 以及，使用 `fs` 的读写模块，结合 `handlebars` 工具实现对文件自动配置化，从而达到约定式路由的效果



以上，我们的 手写 cli 学习就告一段落啦，更多资料，请阅读下面的参考资料，多写多练，你肯定能写出更好用的 cli 呢 ~






参考资料：

- [how-to-build-a-cli-with-node-js](https://www.twilio.com/blog/how-to-build-a-cli-with-node-js) 推荐！！
- [command-line-app-with-nodejs](https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs)
- [Node.js 命令行程序开发教程-阮一峰](https://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)
- [如何从零开始开发一个 node.js 命令行(cli)工具](https://juejin.cn/post/6883070890130145288) 推荐
- [手把手教你用Node.js创建CLI](https://segmentfault.com/a/1190000022721056) 推荐
- [开课吧夏老师-cli代码资料](https://github.com/su37josephxia/kaikeba-cli/blob/master/bin/miku.js)
- [从零开发一个node命令行工具 ](https://www.sohu.com/a/275486462_495695)
- [手把手教你写命令行工具-JavaScript,NodeJs](http://isweety.me/blog/2018/how-to-write-cli-tool/)
- [私人定制 CLI 工具](https://www.infoq.cn/article/j6ohpzleoccbaf8yhgnv)
- [从零开始开发一个Node交互式命令行应用](http://kmanong.top/kmn/qxw/form/article?id=7569&cate=58) 这是一个结合爬虫和node命令行的工具，牛逼！