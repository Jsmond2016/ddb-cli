/*
 * @Description: 
 * @Date: 2021-01-22 11:40:42
 * @Author: Jsmond2016 <jsmond2016@gmail.com>
 * @Copyright: Copyright (c) 2020, Jsmond2016
 */

//  尝试用 ncp 工具拷贝文件，嗯，很好用， 参考：https://www.twilio.com/blog/how-to-build-a-cli-with-node-js
 const copy = require('ncp')


 function copyTemplates(sourceDir, targetDir) {
   return copy(sourceDir, targetDir, (err, files) => {
     if (!err) {
       console.log(files)
     }
   })
 }

 copyTemplates('./template', './testt')