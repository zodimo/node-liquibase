const fromLibrary = require('../../lib/cjs/index');
const POSTGRESQL_DEFAULT_CONFIG = require('../../lib/cjs/constants/defaults/postgresql-default.config').POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
	changeLogFile: POSTGRESQL_DEFAULT_CONFIG.changeLogFile,
	classpath: POSTGRESQL_DEFAULT_CONFIG.classpath,
	url: 'jdbc:postgresql://localhost:5432/node_liquibase_testing',
	username: 'yourusername',
	password: 'yoursecurepassword',
}

const instance = new fromLibrary.Liquibase(myConfig);

doEet();


async function doEet() {
	await instance.status();
	// await instance.update();
	// await instance.dropAll();
}
