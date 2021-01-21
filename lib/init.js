const { promisify } = require('util')

const figlet = promisify(require('figlet'))

const clear = require('clear')
const chalk = require('chalk')
const log = content => console.log(chalk.green(content))
const { clone } = require('./download')

const open = require('open')

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

module.exports = async name => {
  // 打印欢迎界面

  // 1-清屏
  clear()
  // 2-欢迎
  // const data = await figlet('欢迎欢迎')
  // log(data)

  figlet('Hello World!!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
      }
      console.log(data)
  })



  // clone
  // log(`创建项目： ${name}`)

  // await clone('github:su37josephxia/vue-template', name)

  // // 自动安装依赖- 使用子进程的方式去执行
  // log('=====安装依赖=====')
  // await spawn('yarn', ['install'], { cwd: `./${name}`})

  // log(`
  
  // =====安装完成=====

  // =====启动方式=====
  
  // cd ${name}

  // npm run serve

  // or

  // yarn serve
  
  
  // `)

  // // 自动打开浏览器
  // open('http://localhost:8080')


  // // 启动

  // await spawn('yarn', ['serve'], { cwd: `./${name}`} )

}