var program = require('commander');
var { blue } = require('./myColors');

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
program.parse(process.argv)
if( program.debug ){
    blue('option is debug')
}else if(program.small){
    blue('option is small')
}
