#!/usr/bin/env node

const { Command } = require('commander');
const download = require('download-git-repo');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const program = new Command();

const downloadTpl = (templateName, projectName, callback) => {
  // 模板项目保存在远程仓库
  const downloadFromGit = () => {
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
    // git 连接下载 
    const templateUrl = templates[templateName].downloadUrl; // 模板项目git地址
    if (!templateUrl) {
      return callback(new Error('模板不存在'));
    }
    download(templateUrl, projectName, { clone: true }, callback)
  }
  const copyFromLocal = ([folder, templateName]) => {
    const templatePath = path.resolve(__dirname, './templates', folder, templateName);
    const projectPath = projectName;
    if (!templatePath) {
      return callback(new Error('模板不存在'));
    }
    if (fs.existsSync(projectName)) {
      return callback(new Error('文件或文件夹已存在'));
    }
    function filter(src, dest) {
      return !/node_modules/.test(src) && !/dist/.test(src) && !/package-lock/.test(src);
    }
    fse.copy(templatePath, projectPath, { filter }, callback)
  }
  return copyFromLocal(templateName.split(' '));
}

program
  .version('0.1.0', '-V, -v, --version', '脚手架工具版本信息')

program
  .command('init <project-name>')
  .description('初始化项目模板')
  .action((projectName) => {
    inquirer.prompt([{
      type: 'list',
      name: 'type',
      message: '使用哪种技术栈',
      choices: ['React', 'Vue', 'Electron', 'Typescript', 'Egg'],
      filter(val) {
        return val.toLowerCase();
      },
    }]).then(({ type }) => {
      const questions = [
        {
          type: 'input',
          name: 'description',
          message: '请输入项目简介'
        },
        {
          type: 'name',
          name: 'author',
          message: '请输入作者名称'
        }
      ];
      if (type !== 'electron') {
        questions.unshift({
          type: 'list',
          message: '选择哪种打包方式',
          name: 'build',
          choices: ['Webpack', 'Rollup', 'Vite', 'Gulp'],
          filter(val) {
            return val.toLowerCase();
          },
        })
      }
      if (type === 'react') {
        questions.unshift({
          type: 'checkbox',
          name: 'react',
          message: '选择项目配置',
          choices: ['router', 'redux', 'ts', 'eslint'],
        });
      }
      if (type === 'vue') {
        questions.unshift({
          type: 'checkbox',
          name: 'vue',
          message: '选择项目配置',
          choices: ['router', 'vuex', 'ts', 'eslint'],
        });
      }
      inquirer.prompt(questions).then((answers) => {
        const templateName = `${answers.build} ${[type, ...(answers[type] ? answers[type] : [])].join('-')}`;
        const downloadSpinner = ora('正在下载模板...');
        downloadSpinner.start();
        downloadTpl(templateName, projectName, err => {
          if (err) {
            downloadSpinner.fail();
            return console.log(chalk.redBright(err.message ? err.message : '下载模板失败'));
          }
          // 下载成功
          downloadSpinner.succeed();
          const initSpinner = ora('初始化模板...').start();
          try {
            const packagePath = `${projectName}/package.json`;
            const packageContent = fs.readFileSync(packagePath, 'utf-8');
            const packageJson = JSON.parse(packageContent);
            packageJson.name = projectName;
            packageJson.description = answers.description || "";
            packageJson.author = answers.author;
            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
            initSpinner.succeed();
          } catch(err) {
            // console.log(err)
            fse.remove(projectName); // 移除文件夹
            initSpinner.fail();
          }
        })
      })
    })
  })
  
program
  .command('list')
  .description('查看所有的模板')
  .action(() => {
    const templateFolder = path.resolve(__dirname, './templates');
    fse.readdir(templateFolder, (err, folders) => {
      if (err) {
        return console.log(chalk.redBright('出错了1'));
      }
      folders.forEach(folder => {
        if (folder === 'electron') {
          const files = fse.readdirSync(path.join(templateFolder, folder));
          return files.length && console.log(folder);
        }
        fse.readdir(path.join(templateFolder, folder), (err, tpls) => {
          if (err) {
            return console.log(chalk.redBright('出错了'));
          }
          tpls.forEach(tpl => {
            const files = fse.readdirSync(path.join(templateFolder, folder, tpl));
            files.length && console.log(folder, tpl);
          })
        })
      })
    })
  })

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: cmd => cmd.name(),
});

program.parse(process.argv);

