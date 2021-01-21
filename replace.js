const fs = require('fs')

const sourcePath = './package.test.json.hbs'
const targetPath = './package.output.json'

const handlebars = require('handlebars')


function compile(meta, filePath, templatePath) {
  if (fs.existsSync(templatePath)) {
    const content = fs.readFileSync(templatePath).toString()
    const result = handlebars.compile(content)(meta)
    fs.writeFileSync(filePath, result)
    console.log(`${filePath} 创建成功`)
  }
}

compile({ name: '鸥神牛逼'}, targetPath, sourcePath)