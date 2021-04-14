"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTGRESQL_DEFAULT_CONFIG = void 0;
var path_1 = require("path");
exports.POSTGRESQL_DEFAULT_CONFIG = {
    changeLogFile: '/examples/change-log-examples/postgreSQL/changelog.xml',
    url: 'jdbc:postgresql://localhost:5432/postgres',
    username: 'postgres',
    password: '',
    classpath: path_1.join(__dirname, '../../../drivers/postgresql-42.2.8.jar')
};
//# sourceMappingURL=postgresql-default.config.js.map