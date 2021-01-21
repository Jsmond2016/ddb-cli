const question = [
  {
       name:'conf',              /* key */
       type:'confirm',           /* 确认 */
       message:'是否创建新的项目？' /* 提示 */
   },{
       name:'name',
       message:'请输入项目名称？',
       when: res => Boolean(res.conf) /* 是否进行 */
   },{
       name:'author',
       message:'请输入作者？',
       when: res => Boolean(res.conf)
   },{
       type: 'list',            /* 选择框 */
       message: '请选择需要创建的模板',
       name: 'template',
       choices: ['vue-template','react-template'], /* 选项*/
       filter: function(val) {    /* 过滤 */
         return val.toLowerCase()
       },
       when: res => Boolean(res.conf)
   }
]

module.exports = question