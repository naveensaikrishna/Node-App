'use strict';

let sql = require('../query-creator/index.js')
const executeQuery = require('../data/executeQuery.js').executeQuery;
const dataTypeIDs = require('./dataType.js')

const obj = {

    saveConfigurations : async function(req,res) {
    
        let payload = req.body;
          
        let schema = "\"write-back\".";

        let columns = payload.columns;
        if(columns.length == 0)
            return res.send("No columns for mapping")

        let table_name = schema+"mapping_table";
        let fields = {}
            fields['t_name'] = payload.table_name
            fields['tab_dashboard'] = payload.dashboard
            fields['tab_worksheet'] = payload.worksheet

        let insert_query = sql.insert(table_name,fields)


        try {

            let result = await executeQuery(insert_query)

            fields = {}
            fields['tab_dashboard'] = payload.dashboard
            fields['tab_worksheet'] = payload.worksheet
            fields['t_name'] = payload.table_name

            table_name = schema+"columns_mapping_table";

            Object.keys(columns).forEach(async (d,i) => {

                fields['d_column'] = columns[d][0]
                fields['tab_column'] = d

                insert_query = sql.insert(table_name,fields)
                result = await executeQuery(insert_query)
            })

            res.send("Configurations saved")

        } catch (error) {
            console.log("ERRO")
            console.log(error)
            res.send(error)
        }
    }

}

module.exports = obj;