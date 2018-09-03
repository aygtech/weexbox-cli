#! /usr/bin/env node

const program = require('commander')

program
.command('create <app-name>')
.description('使用 weexbox 创建工程')
.action()