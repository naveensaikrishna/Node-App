"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

Object.defineProperty(exports, "__esModule", { value: true });

var Statement = /** @class */ (function () {
    function Statement() {
        this.operation = "";
        this.table = "";
        this.text = "";
        this.values = [];
    }
    Statement.fromFactory = function (dialect) {
        switch (dialect) {
            case "mysql":
                return new MysqlStatement();
            case "mssql":
                return new MssqlStatement();
            default:
            case "postgres":
                return new PostgresStatement();
        }
    };
    Statement.prototype.join = function (table, fields, type) {
        if (type === void 0) { type = "INNER"; }
        var expression = Object.entries(fields).map(function (v, k) { return v[0] + " = " + v[1]; });
        this.text += " " + type + " JOIN " + table + " ON " + expression.join(' AND ');
        return this;
    };
    Statement.prototype.where = function (fields, operator, separator) {
        var _this = this;
        if (operator === void 0) { operator = '='; }
        if (separator === void 0) { separator = 'AND'; }
        if (typeof (fields) == "string") {
            this.text += " WHERE " + fields;
            return this;
        }
        var expression = Object.keys(fields).map(function (v, k) { return v + " " + operator + " $" + (k + _this.values.length + 1); });
        this.values = this.values.concat(Object.values(fields));
        if (expression.length > 1) {
            this.text += " WHERE (" + expression.join(" " + separator + " ") + ")";
        }
        else {
            this.text += " WHERE " + expression.join(" " + separator + " ");
        }
        return this;
    };
    Statement.prototype.and = function (fields, operator, separator) {
        var _this = this;
        if (operator === void 0) { operator = '='; }
        if (separator === void 0) { separator = 'AND'; }
        if (typeof (fields) == "string") {
            this.text += " AND " + fields;
            return this;
        }
        var expression = Object.keys(fields).map(function (v, k) { return v + " " + operator + " $" + (k + _this.values.length + 1); });
        this.values = this.values.concat(Object.values(fields));
        if (expression.length > 1) {
            this.text += " AND (" + expression.join(" " + separator + " ") + ")";
        }
        else {
            this.text += " AND " + expression.join(" " + separator + " ");
        }
        return this;
    };
    Statement.prototype.or = function (fields, operator, separator) {
        var _this = this;
        if (operator === void 0) { operator = '='; }
        if (separator === void 0) { separator = 'AND'; }
        if (typeof (fields) == "string") {
            this.text += " OR " + fields;
            return this;
        }
        var expression = Object.keys(fields).map(function (v, k) { return v + " " + operator + " $" + (k + _this.values.length + 1); });
        this.values = this.values.concat(Object.values(fields));
        if (expression.length > 1) {
            this.text += " OR (" + expression.join(" " + separator + " ") + ")";
        }
        else {
            this.text += " OR " + expression.join(" " + separator + " ");
        }
        return this;
    };
    Statement.prototype.groupby = function (columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        this.text += " GROUP BY " + columns.join(', ');
        return this;
    };
    Statement.prototype.having = function (fields, operator, separator) {
        var _this = this;
        if (operator === void 0) { operator = '='; }
        if (separator === void 0) { separator = 'AND'; }
        var expression = Object.keys(fields).map(function (v, k) { return v + " " + operator + " $" + (k + _this.values.length + 1); });
        this.values = this.values.concat(Object.values(fields));
        this.text += " HAVING " + expression.join(" " + separator + " ");
        return this;
    };
    Statement.prototype.orderby = function (columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        this.text += " ORDER BY " + columns.join(', ');
        return this;
    };
    Statement.prototype.returning = function (columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        this.text += " RETURNING " + columns.join(', ');
        return this;
    };
    Statement.prototype.toString = function (columns) {
        return this.text;
    };
    return Statement;
}());
exports.Statement = Statement;
var PostgresStatement = /** @class */ (function (_super) {
    __extends(PostgresStatement, _super);
    function PostgresStatement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dialect = "postgres";
        return _this;
    }
    PostgresStatement.prototype.limit = function (limit, offset) {
        if (!Number.isInteger(limit))
            throw new Error("Limit should be a number");
        if (offset != undefined && !Number.isInteger(offset))
            throw new Error("Offset should be a number or undefined");
        this.text += " LIMIT " + limit;
        if (offset) {
            this.text += " OFFSET " + offset;
        }
        return this;
    };
    PostgresStatement.prototype.onconflict = function (columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        this.text += " ON CONFLICT ( \"" + columns.join('\", \"')+ "\")";
        return this;
    };
    PostgresStatement.prototype.do = function (action,fields) {

        this.text += " DO ";
        if (action && action.toLowerCase()=='nothing') 
            this.text += " NOTHING ;";

        else if(action && action.toLowerCase()=='update') {

            var columns = Object.keys(fields).map(function (v, k) { return "\""+v + "\" = EXCLUDED.\""+v + "\""; });
            this.text += " UPDATE SET "+ columns.join(", ")
        }
        return this;
    };
    return PostgresStatement;
    
}(Statement));
exports.PostgresStatement = PostgresStatement;
var MysqlStatement = /** @class */ (function (_super) {
    __extends(MysqlStatement, _super);
    function MysqlStatement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dialect = "mysql";
        return _this;
    }
    MysqlStatement.prototype.limit = function (limit, offset) {
        if (!Number.isInteger(limit))
            throw new Error("Limit should be a number");
        if (offset != undefined && !Number.isInteger(offset))
            throw new Error("Offset should be a number or undefined");
        if (offset) {
            this.text += " LIMIT " + offset + ", " + limit;
        }
        else {
            this.text += " LIMIT " + limit;
        }
        return this;
    };
    MysqlStatement.prototype.onconflict = function (columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        this.text += " ON CONFLICT (" + columns.join(', ')+ ")";
        return this;
    };
    MysqlStatement.prototype.do = function (action) {

        this.text += " DO ";
        if (action.toLowerCase()=='nothing') 
            this.text += " NOTHING ;";

        
        return this;
    };
    return MysqlStatement;
}(Statement));
exports.MysqlStatement = MysqlStatement;
var MssqlStatement = /** @class */ (function (_super) {
    __extends(MssqlStatement, _super);
    function MssqlStatement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dialect = "mssql";
        return _this;
    }
    MssqlStatement.prototype.limit = function (limit, offset) {
        throw new Error("Not Implemented");
    };
    return MssqlStatement;
}(Statement));
exports.MssqlStatement = MssqlStatement;
//# sourceMappingURL=statement.js.map