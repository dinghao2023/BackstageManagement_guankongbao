const data = require('./data.json');//引入已经准备好的数据
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data
      }
    }
  }
]
