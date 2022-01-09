"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statement_1 = require("./statement");
var current_dialect = "postgres";
function use(dialect) {
    current_dialect = dialect;
}
exports.use = use;
function select(table, columns) {
    if (!Array.isArray(columns)) {
        columns = [columns];
    }
    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "SELECT";
    statement.table = table;
    statement.text = "SELECT " + columns.join(', ') + " FROM " + table;
    return statement;
}
exports.select = select;
function insert(table, fields) {
    var columns = Object.keys(fields);
    var values = Object.values(fields).map(function (v, k) { return "$" + (k + 1); });
    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "INSERT";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = "INSERT INTO " + table + " (" + columns.join(", ") + ") VALUES (" + values.join(", ") + ")";
    return statement;
}
exports.insert = insert;
function update(table, fields) {
    var columns = Object.keys(fields).map(function (v, k) { return v + " = $" + (k + 1); });
    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "UPDATE";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = "UPDATE " + table + " SET " + columns.join(", ");
    return statement;
}
exports.update = update;
function deletes(table) {
    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "DELETE";
    statement.table = table;
    statement.text = "DELETE FROM " + table;
    return statement;
}
exports.deletes = deletes;


// should work on creating upsert query, create , alter table

function create(table, fields) {
    let columns = []

    for(let k in fields)
        columns = [...columns, k+ " " +fields[k].join(" ")]

    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "CREATE";
    statement.table = table;
    statement.values = [];
    statement.text = "CREATE TABLE " + table + " (\"" + columns.join("\", \"") + "\" );";
    return statement;
}
exports.create = create;


function upsert(table, fields) {
    var columns = Object.keys(fields);
    var values = Object.values(fields).map(function (v, k) { return "$" + (k + 1); });
    var statement = statement_1.Statement.fromFactory(current_dialect);
    statement.operation = "INSERT";
    statement.table = table;
    statement.values = Object.values(fields);
    statement.text = "INSERT INTO " + table + " (\"" + columns.join("\", \"") + "\" ) VALUES ( " + values.join(", ") + ")";
    return statement;
}

exports.upsert = upsert;