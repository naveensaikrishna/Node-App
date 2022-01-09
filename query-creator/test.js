let sql = require('./index.js')

console.log(sql.insert("tbl",{col1:'val1',col2: 'val2'}).onconflict(['col1']).do('update',{col1:'val1',col2: 'val2'}))