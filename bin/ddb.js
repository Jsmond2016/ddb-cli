#!/usr/bin/env node
'use strict';


const program = require('commander')
program.version(require('../package.json').version)

program
  .command("init <name>")
  .description("init project")
  .action(require('../lib/init'))


  program.parse(process.argv)