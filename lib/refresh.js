const fs = require('fs')

const handlebars = require('handlebars')

const chalk = require('chalk')

module.exports = async () => {
  // 获取列表
  const list = fs.readdirSync('./testt/src/views')
            .filter(v => v !== 'Home.vue')
            .map(item => ({
              name: item.replace('.vue', '').toLowerCase(),
              file: item
            }))
  // 生成路由定义
  compile({list}, './testt/src/router.js', './testt/template/router.js.hbs')

  // 生成菜单
  compile({list}, './testt/src/App.vue', './testt/template/App.vue.hbs')

  /**
   * 模板编译
   * @param {*} meta 数据定义
   * @param {*} filePath 目标文件
   * @param {*} templatePath 模板文件
   */
  function compile(meta, filePath, templatePath) {
    if (fs.existsSync(templatePath)) {
      const content = fs.readFileSync(templatePath).toString()
      const result = handlebars.compile(content)(meta)
      fs.writeFileSync(filePath, result)
      console.log(`${filePath} 创建成功`)
    }
  }



}