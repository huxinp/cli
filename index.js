#!/usr/bin/env node

const { Command } = require('commander');
const download = require('download-git-repo');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const program = new Command();

const templates = {
  'react': {
    downloadUrl: '',
    description: 'a模板'
  },
  'vue': {
    downloadUrl: '',
    description: 'b模板'
  },
  'electron': {
    downloadUrl: '',
    description: 'c模板'
  },
  'node': {
    downloadUrl: '',
    description: 'd模板'
  }
}

const downloadTpl = (templateName, projectName, callback) => {
  // 模板项目保存在远程仓库
  const downloadFromGit = () => {
    // git 连接下载 
    const templateUrl = templates[templateName].downloadUrl; // 模板项目git地址
    if (!templateUrl) {
      return callback(new Error('模板不存在'));
    }
    download(templateUrl, projectName, { clone: true }, callback)
  }
  const copy = (src, dest, callback) => {
    if (!fs.existsSync(src)) {
      throw new Error('模板不存在');
      return
    }
    if (fs.existsSync(dest)) {
      throw new Error('文件或文件夹已存在');
      return
    }
    fs.mkdir(dest, (err) => {
      if (err) {
        throw new Error('创建文件夹失败');
        return
      }
      const srcFile = fs.readdirSync(src);
      for (const file of srcFile) {
        const srcFile = path.resolve(src, file);
        const destFile = path.resolve(dest, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
          copy(srcFile, destFile, callback);
        } else {
          fs.copyFileSync(srcFile, destFile);
        }
      }
    })
  }
  const copyFromLocal = () => {
    const templatePath = path.resolve(__dirname, './templates', templateName);
    const projectPath = projectName;
    if (!templatePath) {
      return callback(new Error('模板不存在'));
    }
    try {
      copy(templatePath, projectPath, callback);
      callback();
    } catch (err) {
      callback(err);
    }
  }
  return copyFromLocal();
}

program
  .version('0.1.0', '-V, -v, --version', '脚手架工具版本信息')
  
program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action(function (templateName, projectName) {
    console.log(templateName, projectName)
    const spinner = ora('正在下载模板...');
    spinner.start();
    downloadTpl(templateName, projectName, (err) => {
      if (err) {
        spinner.fail();
        err.message && console.log(chalk.red(err.message))
        return console.log(chalk.red('初始化模板失败'));
      }
      // 下载成功
      spinner.succeed();
      // 使用向导的方式采集用户输入的值
      inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称'
        },
        {
          type: 'input',
          name: 'description',
          message: '请输入项目简介'
        },
        {
          type: 'name',
          name: 'author',
          message: '请输入作者名称'
        },
      ]).then((answers) => {
        console.log(answers);
        // 使用模板引擎把用户输入的数据解析到 package.json 文件中
        // 解析完毕， 把解析之后的结果重新写入package.json 文件中
        console.log(process.argv)
        const packagePath = `${projectName}/package.json`;
        const packageContent = fs.readFileSync(packagePath, 'utf-8');
        const packageResult = handlebars.compile(packageContent)(answers);
        fs.writeFileSync(packagePath, packageResult);
        console.log(chalk.green('初始化模板成功'));
      })
    });
  })
  
program
  .command('list')
  .description('查看所有的模板')
  .action(() => {
    Object.entries(templates).forEach(([key, opt]) => {
      console.log(key, opt.description)
    })
  })

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: cmd => cmd.name(),
});

program.parse(process.argv);
