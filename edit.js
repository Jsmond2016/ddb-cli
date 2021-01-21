

const fs = require('fs')
const filePath = './package.output.json'


function getData() {
  const data = fs.readFileSync(filePath, { encoding: 'utf8'})
  return data.toString()
}

function writeData(config = { name: "哈哈哈哈哈哈" }) {
  const data = JSON.parse(getData())
  const newData = JSON.stringify({
    ...data,
    ...config
  }, null, 2)
  fs.writeFileSync(filePath, newData, { encoding: 'utf8'})
  console.log(getData())
}


writeData()
