#!/usr/bin/env node
'use strict';

var program = require('commander');
var { blue, green, yellow, red } = require('../utils/index.js')
var question = require('../src/question')
var inquirer = require('inquirer')
const create = require('../src/create')
const start = require('../src/start')


program
    .version('0.0.1')
    .parse(process.argv);


program
	.command('create')
	.description('create a project')
	.action(function() {
		green('-_-' + '欢迎使用 mycli，轻松构建 react-ts 项目')
		// 人机交互，详情见 question 文件
		inquirer.prompt(question).then((answer) => {
			if (answer.conf) {
				console.log('answer.conf: ', answer.conf);
				// 创建文件
				create(answer)
			}
		})
	})


	/* mycli start 运行项目 */
program
.command('start')
 .description('start a project')
 .action(function(){
    green('--------运行项目-------')
    /* 运行项目 */
     start('start').then(()=>{
		green('-------*******运行完成-------')
	})
 })

 
/* mycli build 打包项目 */
program
.command('build')
.description('build a project')
.action(function(){
    green('--------构建项目-------')
    /* 打包项目 */
    start('build').then(()=>{
		green('-------*******构建完成-------')
	})
})


program.parse(process.argv)












