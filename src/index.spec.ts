require('dotenv').config();
import * as path from 'path';
import { Liquibase } from './index';
import { LiquibaseConfig } from './models/index';

describe('Liquibase', () => {
	const validPostgresConfig: LiquibaseConfig = {
		changeLogFile: '/examples/change-log-examples/postgreSQL/changelog.xml',
		url: 'jdbc:postgresql://localhost:5432/node_liquibase_testing',
		username: /* process.env.LOCAL_PG_USER || */ 'yourusername',
		password: /* process.env.LOCAL_PG_PASS || */ 'yoursecurepassword',
		classpath: path.join(__dirname, '../drivers/postgresql-42.2.8.jar')
		// classpath: 'drivers/postgresql-42.2.8.jar',
	};
	describe('#constructor', () => {
		it('should create an instance', () => {
			const instance = new Liquibase(validPostgresConfig);
			expect(instance).toBeInstanceOf(Liquibase);
		});
	});

	describe('#status', () => {
		it('should succeed', async (done) => {
			const instance = new Liquibase(validPostgresConfig);
			const test = await instance.status();
			expect(test).toBeTruthy();
			done();
		});

		it('should fail', async (done) => {
			const config: LiquibaseConfig = {
				...validPostgresConfig,
				classpath: undefined,
			};
			const instance = new Liquibase(config);
			expect(instance).toBeDefined();
			await expect(instance.status()).rejects.toThrow();
			done();
		});
	});
});
