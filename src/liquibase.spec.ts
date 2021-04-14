require('dotenv').config();
import { join } from 'path';
import { Liquibase } from './index';
import { LiquibaseConfig } from './models/index';
import { POSTGRESQL_DEFAULT_CONFIG } from './constants/defaults/postgresql-default.config';

describe('Liquibase', () => {
	const validPostgresConfig: LiquibaseConfig = {
		...POSTGRESQL_DEFAULT_CONFIG,
		username: 'yourusername',
		password: 'yoursecurepassword',
	};
	describe('#constructor', () => {
		it('should create an instance', () => {
			const instance = new Liquibase(validPostgresConfig);
			expect(instance).toBeInstanceOf(Liquibase);
		});
	});

	describe('#status', () => {
		it('should succeed', async (done) => {
			console.warn(validPostgresConfig.classpath)
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
