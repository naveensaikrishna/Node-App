let sql = require('../query-creator/index.js')
const pool = require('./pg.js')

const obj = {
    savedata : async function(req,res) {

        console.log(req.body);

        let columns = req.body.columns;
        let rows = req.body.dataset;
        let fields ={}
        let schema = "\"write-back\""
        let table = "\"Test\""

        for(let r=0; r<rows.length;r++){
            let row = rows[r]
            for(let c = 0; c<columns.length; c++) {
                fields[columns[c]] = row[c]
            }
            
            let query = sql.upsert(schema+"."+table,fields).onconflict([columns[0],columns[1]]).do('update',fields)

            console.log(query)
            try {

                let  result = await executeQuery(query)
                
                res.send("Data saved")
            } catch (error) {
                console.log(error)
            }
        }

    }
}

module.exports = obj;

function executeQuery(query) {
    
    return new Promise( (resolve,reject) => {

        pool.query(query.text, query.values , (err, res) => {           
            if(err) {
                reject(err)
                return
            }
            resolve("Success")
          })      
    })
}