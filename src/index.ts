#!/usr/bin/env node
import {spawn} from 'child_process';
import {join} from 'path';
import {LiquibaseCommands} from './enums/liquibase-commands.enum';
import {
	CalculateCheckSumCommandAttributes,
	LiquibaseConfig,
	UpdateCommandAttributes,
	UpdateSQLCommandAttributes,
	UpdateCountCommandAttributes,
	UpdateCountSQLCommandAttributes,
	UpdateToTagCommandAttributes,
	UpdateToTagSQLCommandAttributes
} from './models/index';

export class Liquibase {
	/**
	 * @description Returns an instance of a lightweight Liquibase Wrapper.
	 *
	 * @param params Configuration for an instance of `Liquibase`
	 *
	 * * @example
	 * ```javascript
	 * const liquibase = require('node-liquibase');
	 *
	 * const config = {
	 *   contexts: 'TEST,DEV',
	 *   labels: 'staging,Jira-1200',
	 *   logLevel: 'debug',
	 *   overwriteOutputFile: 'true',
	 *   logFile: 'myLog.log'
	 * };
	 *
	 * liquibase(config)
	 *   .run('status', '--verbose')
	 *   .then(() => console.log('success'))
	 *   .catch((err) => console.error('fail', err));
	 * ```
	 */
	constructor(
		private params: LiquibaseConfig,
	) {
		this.mergeParamsWithDefaults(params);
	}

	/**
	 * The update command deploys any changes that are in the changelog file and that have not been deployed to your database yet.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The update command is typically used to apply database changes that are specified in the changelog file to your database.
	 * When you run the update command, Liquibase sequentially reads changesets in the changelog file, then it compares the unique identifiers of id, author, and path to filename to the values stored in the DATABASECHANGELOG table.
	 *
	 *	<ul>
	 * 		<li>If the unique identifiers do not exist, Liquibase will apply the changeset to the database.</li>
	 * 		<li>If the unique identifiers exist, the MD5Sum of the changeset is compared to the one in the database.</li>
	 * 		<li>If they are different, Liquibase will produce an error message that someone has changed it unexpectedly. However, if the status of the runOnChange or runAlways changeset attribute is set to TRUE, Liquibase will re-apply the changeset.</li>
	 *	</ul>
	 *
	 * {@link https://docs.liquibase.com/commands/community/update.html Documentation}
	 */
	public update(params: UpdateCommandAttributes): void {
		this.run(LiquibaseCommands.Update, params);
	}

	/**
	 * The updateSQL command is a helper command that allows you to inspect the SQL Liquibase will run while using the update command.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The updateSQL command is used when you want to inspect the raw SQL before running the update command, so you can correct any issues that may arise before running the command. Liquibase uses the raw SQL to apply database changes you have added to the changelog file.
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatesql.html Documentation}
	 */
	public updateSQL(params: UpdateSQLCommandAttributes): void {
		this.run(LiquibaseCommands.UpdateSql, params);
	}

	/**
	 * The updateCount <value> command updates a specified number of changesets, where <value> is the number of changesets you want to update sequentially on your database.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The updateCount <value> command is mainly used when you want to apply changes and update changesets sequentially, starting with the changesets from the top of the changelog file until the number specified is reached.
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatecount.html Documentation}
	 */
	public updateCount(params: UpdateCountCommandAttributes): void {
		this.run(LiquibaseCommands.UpdateCount, params);
	}

	/**
	 * The updateCountSQL <value> command is a helper command that inspects the SQL Liquibase will run while using the updateCount <value> command.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The updateCountSQL <value> command is used to inspect the raw SQL before running the updateCount <value> command, so you can correct any issues that may arise before running the command. Liquibase uses the raw SQL to apply a specified number of database changes you have added to the changelog file.
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatecountsql.html Documentation}
	 */
	public updateCountSQL(params: UpdateCountSQLCommandAttributes): void {
		this.run(LiquibaseCommands.UpdateCountSql, params);
	}

	/**
	 * updateTestingRollback tests rollback support by deploying all pending changesets to the database, executes a rollback sequentially for the equal number of changesets that were deployed, and then runs the update again deploying all changesets to the database.
	 *
	 * @description updateTestingRollback is typically used when you want to test rollback functionality when deploying changesets in your changelog sequentially. Run updateTestingRollback only when all pending changelogs have been verified as ready to be deployed as you cannot specify changesets to exclude.
	 * updateTestingRollback utilizes a multi-step operation and runs in sequential order:
	 * 	<ul>
	 * 		<li>update changeset1; update changeset2; update changeset3</li>
	 * 		<li>rollback changeset3; rollback changeset2; rollback changeset1</li>
	 * 		<li>update changeset1; update changeset2 update changeset3</li>
	 * </ul>
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatetestingrollback.html Documentation}
	 */
	public updateTestingRollback(): void {
		this.run(LiquibaseCommands.UpdateTestingRollback);
	}

	/**
	 * The updateToTag <tag> command applies sequential changes to your database from the newest changeset to the changeset with the tag you specified and applied earlier.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The updateToTag <tag> command is mainly used to apply changes sequentially, starting with the changesets from the top of the changelog file until the specified tag is reached. Even though there are other undeployed changes in the changelog, the command deploys only the changesets associated with a specific tag.
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatetotag.html Documentation}
	 */
	public updateToTag(params: UpdateToTagCommandAttributes): void {
		this.run(LiquibaseCommands.UpdateToTag, params);
	}

	/**
	 * The updateToTagSQL <tag> command is a helper command that inspects the SQL Liquibase will run while using the updateToTag <tag> command.
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The updateToTagSQL <tag> command is used to inspect the raw SQL before running the updateToTag <tag> command, so you can correct any issues that may arise before running the command. Liquibase uses the raw SQL to apply database changes you have added to the changelog file based on the tag specified.
	 *
	 * {@link https://docs.liquibase.com/commands/community/updatetotagsql.html Documentation}
	 */
	public updateToTagSQL(params: UpdateToTagSQLCommandAttributes): void {
		this.run(LiquibaseCommands.UpdateToTagSql, params);
	}

	/**
	 * The validate command checks and identifies any possible errors in a changelog that can cause the update command to fail.
	 *
	 * @description The validate command is mainly used when you want to detect if there are any issues with a changelog before running the update command.
	 * With the help of the validate command, you can avoid a partial update, where only some changesets are applied due to an error in your changelog file.
	 * Use the validate command to ensure that:
	 * 	<ul>
	 * 		<li>The XML/YAML/JSON/formatted SQL is structured correctly</li>
	 * 		<li>Referenced files can be found</li>
	 * 		<li>There are no duplicated id/author/file combinations</li>
	 * 		<li>There aren't any checksum errors</li>
	 * 		<li>Any required or not allowed attributes are correct for your database</li>
	 * </ul>
	 *
	 * {@link https://docs.liquibase.com/commands/community/validate.html Documentation}
	 */
	public validate(): void {
		this.run(LiquibaseCommands.Validate);
	}

	/**
	 * The calculateCheckSum <id> command calculates and prints a checksum for the changeset with the specified id in the following format: filepath::id::author.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The calculateCheckSum <id> command is typically used to compute an MD5 checksum, which serves as a unique identifier for the changeset. As a result, you can see whether the changeset has been changed and whether it has to be deployed differently now.
	 * When running the calculateCheckSum <id> command, the DATABASECHANGELOG table calculates an MD5 checksum for each entry based on the SQL script of the changeset. This checksum helps Liquibase detect differences between the changesets you want to deploy and the changesets that have already been run against the database.
	 * The MD5SUM column in the DATABASECHANGELOG table contains a checksum of the changeset and any change made in the changeset will result in a different checksum.
	 *
	 * {@link https://docs.liquibase.com/commands/community/calculatechecksum.html Documentation}
	 */
	calculateCheckSum(params: CalculateCheckSumCommandAttributes): void {
		this.run(LiquibaseCommands.CalculateCheckSum, params);
	}

	private stringifyParams(params: { [key: string]: any }) {
		let commandString = '';

		for (const property in params) {
			const targetValue = params[property];
			commandString += `--${property}=${JSON.stringify(targetValue)} `
		}

		return commandString;
	}

	/**
	 * LEGACY CODE START
	 */
	/**
	 * Spawns a Liquibase command.
	 * @param {*} action a string for the Liquibase command to run. Defaults to `'update'`
	 * @param {*} params any parameters for the command
	 * @returns {Promise} Promise of a node child process.
	 */
	private run(action: LiquibaseCommands, params: { [key: string]: any } = {}) {
		const paramString = this.stringifyParams(params);
		return this.spawnChildProcess(`${this.liquibasePathAndGlobalAttributes} ${action} ${paramString}`);
	}

	/**
	 * Internal Getter that returns a node child process compatible command string.
	 * @returns {string}
	 * @private
	 */
	private get liquibasePathAndGlobalAttributes() {
		let liquibasePathAndGlobalAttributes = `${this.params.liquibase}`;
		Object.keys(this.params).forEach(key => {
			if (key === 'liquibase') {
				return;
			}
			const value = (this.params as { [key: string]: any })[key];
			liquibasePathAndGlobalAttributes = `${liquibasePathAndGlobalAttributes} --${key}=${value}`;
		});
		return liquibasePathAndGlobalAttributes;
	}

	/**
	 *
	 * Internal method for executing a child process.
	 * @param {*} commandString Liquibase commandString
	 */
	private spawnChildProcess(commandString: string): Promise<number | null | Error> {
		console.log(`Running ${commandString}...`);

		return new Promise((resolve, reject) => {
			const spawnedChild = spawn(commandString);
			spawnedChild.on('error', (err) => {
				return reject(err);
			});

			spawnedChild.on('close', (code) => {
				console.log(`Exited with code ${code}`);
				return resolve(code);
			});

			spawnedChild.stdout.on('data', (standardOutput) => {
				console.log('\n', standardOutput);
			});

			spawnedChild.stderr.on('data', (standardError) => {
				console.error('\n', standardError);
			});
		});
	}

	private mergeParamsWithDefaults(params: LiquibaseConfig) {
		const defaultParams = {
			// MSSQL Default Parameters
			liquibase: join(__dirname, './liquibase/liquibase'),
			changeLogFile: join(__dirname, './change-log-examples/mssql/changelog.mssql.sql'),
			url: '"jdbc:sqlserver://<IP OR HOSTNAME>:<port number>;database=<database name>;"',
			username: '<username>',
			password: '<password>',
			// liquibaseProLicenseKey: '<paste liquibase-pro-license-key here>',
			classpath: join(__dirname, './drivers/mssql-jdbc-7.4.1.jre8.jar')
			// PostgreSQL Default Parameters Template
			// liquibase: 'liquibase/liquibase',
			// changeLogFile: 'change-log-examples/postgreSQL/changelog.postgresql.sql',
			// url: 'jdbc:postgresql://<IP OR HOSTNAME>:5432/MY_DATABASE_TEST',
			// username: 'postgres',
			// password: 'password',
			// //liquibaseProLicenseKey: '<paste liquibase-pro-license-key here>',
			// classpath: 'drivers/postgresql-42.2.8.jar'
		};

		this.params = Object.assign({}, defaultParams, params);
	}

	/**
	 * LEGACY CODE END
	 **/
}
