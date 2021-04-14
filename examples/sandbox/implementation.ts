import { LiquibaseConfig, Liquibase, POSTGRESQL_DEFAULT_CONFIG } from '../../lib/esm'

const myConfig: LiquibaseConfig = {
	...POSTGRESQL_DEFAULT_CONFIG,
	url: 'jdbc:postgresql://localhost:5432/node_liquibase_testing',
	username: 'yourusername',
	password: 'yoursecurepassword',
}
const instance = new Liquibase(myConfig);

async function doEet() {
	await instance.status();
	// await instance.update();
	// await instance.dropAll();
}

doEet();
