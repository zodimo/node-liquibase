"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSSQL_DEFAULT_CONFIG = void 0;
var path_1 = require("path");
exports.MSSQL_DEFAULT_CONFIG = {
    url: 'jdbc:sqlserver://<IP_OR_HOSTNAME>:;database=sqlserver;',
    changeLogFile: '/examples/change-log-examples/mssql/changelog.xml',
    username: 'sa',
    password: '',
    classpath: path_1.join(__dirname, '../../../drivers/mssql-jdbc-7.4.1.jre8.jar')
};
//# sourceMappingURL=mssql-default.config.js.map