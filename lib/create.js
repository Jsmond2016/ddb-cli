
const { clone: download } = require('./download')
const chalk = require('chalk')
const open = require('open')

const log = content => console.log(chalk.green(content))

module.exports = async function (answer = {}) {
  if (!Object.keys(answer)) return
  const { name = 'test', author = 'Tom', template = 'vue-template'} = answer
  const templateMap = {
    'vue-template': 'github:su37josephxia/vue-template',
    'react-template': 'github:NLRX-WJC/react-antd-admin-template'
  }
  const downloadUrl = templateMap[template]

  log(`创建项目： ${name}`)
  await download(downloadUrl, name)
  InstallDev(name)
  openAndStart(name)
}

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
}


const openAndStart = async (name) => {
  // 自动打开浏览器
  open('http://localhost:8080')


  // 启动

  await spawn('yarn', ['serve'], { cwd: `./${name}`} )
}