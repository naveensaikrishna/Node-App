'use strict';

let sql = require('../query-creator/index.js')
const executeQuery = require('../data/executeQuery.js').executeQuery;
const dataTypeIDs = require('./dataType.js')

const obj = {

    getAllSchemas : async function(req,res) {
    
        let table="\"write-back\".tables_list";
        let columns = ["t_id","t_name"]

        let query = sql.select(table,columns)

        try {

            let  result = await executeQuery(query)

            let table_names = result.rows.map( (d,i) => d['t_name'])
            res.send(table_names)

        } catch (error) {
            console.log(error)
        }
    },
    createSchema : async function(req,res) {
    
        let payload = req.body;
        
        
        let schema = "\"write-back\".";
        let table= schema+"tables_list";
        let columns = ["t_id","t_name"]

        let query = sql.select(table,columns)

        try {

            let result = await executeQuery(query)
            
            let index = result.rows.findIndex( (d,i) => d['t_name'] == payload.table_name)
            
            if(index != -1){
                return res.send("table name already exists")
            }

            table = schema + payload.table_name;
            columns = payload.columns;
            let constraints = payload.constraints;

            let tables_list = schema+"tables_list";
            let i_columns = {}
                i_columns['t_owner'] = 'owner'
                i_columns['t_name'] = payload.table_name
            

            let insert_query = sql.insert(tables_list,i_columns)

            let create_query = sql.create(table,columns,constraints)
            
            console.log(create_query)
                result = await executeQuery(create_query)
                console.log(insert_query)
                result = await executeQuery(insert_query)

            res.send(create_query)

        } catch (error) {
            console.log("ERRO")
            console.log(error)
            res.send(error)
        }
    },
    getColumns : async function(req,res) {
    
        let schema="\"write-back\".";
        let columns = ["*"]

        if(req.query.table_name == undefined)
            return res.send("table_name is not available")
            
        let table = schema  + req.query.table_name;

        let query = sql.select(table,columns).limit(0);

        try {

            let result = await executeQuery(query)
            
           let fields = result.fields.map( d=> {

                let obj = {}
                    obj['name'] = d.name
                    obj['dataType'] = Object.keys(dataTypeIDs)[Object.values(dataTypeIDs).indexOf(d.dataTypeID)]
                
                return obj;
           });

            res.send(fields)

        } catch (error) {
            console.log(error)
        }
    },

}

module.exports = obj;