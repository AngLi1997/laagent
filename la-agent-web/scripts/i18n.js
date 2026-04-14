const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

// 从命令行参数获取 serverUrl 或使用默认值
const args = process.argv.slice(2);
const serverUrlArg = args.find(arg => arg.startsWith('--serverUrl='));
const serverUrl = serverUrlArg ? serverUrlArg.split('=')[1] : 'http://172.30.1.160:8848'; // 默认值
const dataId = 'bmos-agent_zh_CN.json'; // 默认值

const tFunctionRegex = /t\((['"`])([^'"`\u4E00-\u9FA5]*[\u4E00-\u9FA5][^'"`]*)\1\)/g;

const chineseDict = {};

const excludes = ['node_modules', 'dist', '.git', 'bmos-bims-web', 'bmos-bsms-web', 'bmos-lisms-web'];

// 添加变量来跟踪处理进度
let processedFiles = 0;
let totalFiles = 0;

// 计算总文件数的函数
function countTotalFiles(dirPath) {
  let count = 0;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory() && !excludes.includes(file)) {
      count += countTotalFiles(fullPath);
    }
    else if (stats.isFile()) {
      count++;
    }
  });

  return count;
}

function traverseDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory() && !excludes.includes(file)) {
      traverseDirectory(fullPath);
    }
    else if (stats.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      let matches;

      // eslint-disable-next-line no-cond-assign
      while ((matches = tFunctionRegex.exec(content)) !== null) {
        const chinese = matches[2];
        // 存入 JSON 对象
        chineseDict[chinese] = chinese;
      }

      // 更新处理进度并显示
      processedFiles++;
      const percentage = Math.floor((processedFiles / totalFiles) * 100);
      // 清除当前行并重置光标
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`中文字符提取中... ${percentage}% (${processedFiles}/${totalFiles})`);
    }
  });
}

function saveJson() {
  try {
    fetch(`${serverUrl}/nacos/v1/auth/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: 'nacos',
        password: 'nacos',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const accessToken = data.accessToken;
        console.log('Access Token:', accessToken);
        // get query 参数
        const params = new URLSearchParams({
          dataId,
          group: 'frontend-i18n',
          show: 'all',
          username: 'nacos',
          accessToken,
        });
        fetch(`${serverUrl}/nacos/v1/cs/configs?${params.toString()}`)
          .then(response => response.json())
          .then((configData) => {
            const content = JSON.parse(configData.content);
            // 遍历 chineseDict，如果 content 中不存在，则添加
            const newContent = {};
            for (const key in chineseDict) {
              if (!content[key]) {
                content[key] = key;
                newContent[key] = key;
              }
            }
            const updatedJsonContent = JSON.stringify(content, null, 2);
            fs.writeFileSync('scripts/updated-chinese-strings.json', updatedJsonContent, 'utf-8');

            const newJsonContent = JSON.stringify(newContent, null, 2);
            fs.writeFileSync('scripts/new-chinese-strings.json', newJsonContent, 'utf-8');
            console.log('中文字符提取完成，已保存为 scripts/chinese-strings.json');
          });
      });
  }
  catch (error) {
    console.error('Failed to save JSON file', error);
  }
}

const rootDir = './'; // 可修改为你的项目路径
console.log('正在计算文件总数...');
totalFiles = countTotalFiles(rootDir);
console.log(`总共找到 ${totalFiles} 个文件`);
console.log('中文字符提取中...');
traverseDirectory(rootDir);
console.log('\n提取完成，正在保存...');
saveJson();
