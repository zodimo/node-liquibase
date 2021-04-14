import { join } from 'path';
export var POSTGRESQL_DEFAULT_CONFIG = {
    changeLogFile: '/examples/change-log-examples/postgreSQL/changelog.xml',
    url: 'jdbc:postgresql://localhost:5432/postgres',
    username: 'postgres',
    password: '',
    classpath: join(__dirname, '../../../drivers/postgresql-42.2.8.jar')
};
//# sourceMappingURL=postgresql-default.config.js.map