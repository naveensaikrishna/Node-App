'use strict';

const pool = require('./pg.js')

const obj = {

    executeQuery : function(query) {
    
        return new Promise( (resolve,reject) => {
    
            pool.query(query.text, query.values , (err, res) => {           
                if(err) {
                    reject(err)
                    return
                }
                resolve(res)
              })      
        })
    }
}

module.exports = obj;

