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
				console.log('answer.conf: ', answer.conf);
				// 创建文件
				// create(answer)
			}
		})
  })

// program
//   .command("init <name>")
//   .description("init project")
//   .action(require('../lib/init'))


// program
//   .command("refresh")
//   .description("refresh routers and menu")
//   .action(require('../lib/refresh'))


  program.parse(process.argv)