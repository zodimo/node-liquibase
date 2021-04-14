#!/usr/bin/env node
import { spawn } from 'child_process';
import { join } from 'path';
import { LiquibaseCommands } from './enums/liquibase-commands.enum';
import {
	CalculateCheckSumCommandAttributes,
	FutureRollbackCountSQLCommandAttributes, GenerateChangeLogCommandAttributes,
	LiquibaseConfig,
	UpdateCommandAttributes
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
	* If the unique identifiers do not exist, Liquibase will apply the changeset to the database.
	* If the unique identifiers exist, the MD5Sum of the changeset is compared to the one in the database.
	* If they are different, Liquibase will produce an error message that someone has changed it unexpectedly. However, if the status of the runOnChange or runAlways changeset attribute is set to TRUE, Liquibase will re-apply the changeset.
	*/
	public update(params: UpdateCommandAttributes) {
		this.run(LiquibaseCommands.Update, params);
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
	public calculateCheckSum(params: CalculateCheckSumCommandAttributes) {
		this.run(LiquibaseCommands.CalculateCheckSum, params);
	}

	/**
	 * dropAll drops all database objects owned by the user. dropAll will not drop functions, procedures, or packages for the community version of Liquibase. Functions, procedures, packages, and synonyms can only be dropped for Liquibase Pro supported objects.
	 *
	 * @description dropAll is typically used when there is a need to prepare an environment schema to be identical to another environment schema. dropAll is useful in the developer and test environments to remove unwanted objects to reset the database to “empty”.
	 *
	 * The command makes it easier to standardize another schema, compared to manually deleting the objects, or dropping and recreating the desired schema.
	 * dropAll should not be used in a production environment to prevent removal of required objects.
	 *
	 * {@link https://docs.liquibase.com/commands/community/dropall.html Documentation}
	 */
	public dropAll() {
		this.run(LiquibaseCommands.CalculateCheckSum);
	}

	/**
	 * The futureRollbackSQL command is a helper command that produces the raw SQL Liquibase would need to roll back changes that have not yet been deployed to your database.
	 *
	 * @description You can use the futureRollbackSQL command to inspect the raw SQL Liquibase would use to revert changes associated with undeployed changesets.
	 * It is best practice to inspect SQL Liquibase would run when using the update command so you can review any changes the command would make to your database.
	 *
	 * {@link https://docs.liquibase.com/commands/community/futurerollbacksql.html Documentation}
	 */
	public futureRollbackSQL(): void {
		this.run(LiquibaseCommands.FutureRollbackSql);
	}

	/**
	 * The futureRollbackCountSQL <value> command generates the SQL that Liquibase would use to sequentially revert the number of changes associated with undeployed changesets, which are added to a changelog file.
	 *
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The futureRollbackCountSQL <value> command is typically used to inspect the SQL before rolling back the number of changesets that you have not deployed to your database but added to your changelog. The command shows the output starting with the most recent changes until the value specified is reached.
	 * It is best practice to inspect SQL, which Liquibase would run when using the rollback command so you can review any changes the command would make to your database.
	 * {@link https://docs.liquibase.com/commands/community/futurerollbackcountsql.html Documentation}
	 */
	public futureRollbackCountSQL(params: FutureRollbackCountSQLCommandAttributes): void {
		this.run(LiquibaseCommands.FutureRollbackCountSql, params);
	}

	/**
	 * The generateChangeLog command creates a changelog file that has a sequence of changesets which describe how to re-create the current state of the database.
	 *
	 * @param params Arguments/Attributes for the command
	 *
	 * @description The generateChangeLog command is typically used when you want to capture the current state of a database, then apply those changes to any number of databases. This is typically only done when a project has an existing database, but hasn't used Liquibase before.
	 * See {@link https://docs.liquibase.com/workflows/liquibase-community/existing-project.html How to set up Liquibase with an Existing Project and Multiple Environments} for more details.
	 *
	 * {@link https://docs.liquibase.com/commands/community/generatechangelog.html Documentation}
	 */
	public generateChangeLog(params: GenerateChangeLogCommandAttributes): void {
		this.run(LiquibaseCommands.GenerateChangeLog, params);
	}

	/**
	 * The --help command lists all the available Liquibase commands, required and optional parameters, and changelog property. The command also presents Liquibase Hub commands— registerChangeLog, syncHub, and the hubAPIKey property with the definitions.
	 *
	 * @description The --help command is typically used to check the syntax of commands, their definitions, and parameters. The command provides the output that includes the following:
	 *	<ul>
	 *	   <li>Standard commands</li>
	 *	   <li>Diff commands</li>
	 *	   <li>Documentation commands</li>
	 *	   <li>Maintenance commands</li>
	 *	   <li>Hub commands</li>
	 *	   <li>Required parameters</li>
	 *	   <li>Optional parameters</li>
	 *	   <li>Required diff parameters</li>
	 *	   <li>Optional diff parameters</li>
	 *	   <li>changelog properties</li>
	 *	   <li>Hub integration CLI parameter</li>
	 *	</ul>
	 *
	 * {@link https://docs.liquibase.com/commands/community/help.html Documentation}
	 */
	public help(): void {
		this.run(LiquibaseCommands.Help);
	}

	/**
	 * The history command is a helper command that lists out all your deploymentIds and all changesets associated with each deploymentId.
	 *
	 * @description The history command is typically used when you want to inspect a particular group of changes to ensure that they have been applied to the database.
	 *
	 * {@link https://docs.liquibase.com/commands/community/history.html Documentation}
	 */
	public history(): void {
		this.run(LiquibaseCommands.History);
	}

	/**
	 * listLocks returns the hostname, IP address, and the timestamp the Liquibase lock record was added to the DATABASECHANGELOGLOCK table.
	 *
	 * @description listLocks is typically used when an error occurs during a database deployment. The error might indicate that there is a lock record in the DATABASECHANGELOGLOCK table by another user that is preventing Liquibase from applying changes to the specified database.
	 * listLocks will read the DATABASECHANGELOGLOCK table and return a list that includes the hostname, IP address, and the timestamp the lock record was granted to the DATABASECHANGELOGLOCK table and determines the connections to the DATABASECHANGELOGLOCK table based on the database URL.
	 *
	 * {@link https://docs.liquibase.com/commands/community/listlocks.html Documentation}
	 */
	public listLocks(): void {
		this.run(LiquibaseCommands.ListLocks);
	}

	/**
	 * The markNextChangeSetRan command marks the next change you apply as executed in your database.
	 *
	 * @description The markNextChangeSetRan command is typically used when you have made a change manually, and the deployment is failing. Here is a use case that shows the whole process in more detail:
	 *
	 * <ul>
	 *     <li>
	 *         You have a changelog with a specific changeset and want to create a table in your database, and then apply your changes manually without using Liquibase. In this case, there will be no record of this change in the DATABASECHANGELOG table.
	 *     </li>
	 *     <li>
	 *         Then you decide to deploy the same changeset by using the update command, Liquibase checks the DATABASECHANGELOG table to see if there is such a changeset. Since there is no record of it, Liquibase tries to create a table, but as it already exists, you receive an error.
	 *     </li>
	 *     <li>
	 *         As a result, Liquibase stops deployment at that specific changeset without executing it.
	 *     </li>
	 *     <li>
	 *         Running the markNextChangeSetRan adds that changeset in the changelog as a record even though the table is already created. The command detects that the changeset was deployed.
	 *     </li>
	 * </ul>
	 *
	 * Additionally, the best practice is to run the markNextChangeSetRanSQL helper command to inspect the markNextChangeSetRan SQL, so you can correct any issues that may arise before running the command.
	 *
	 * {@link https://docs.liquibase.com/commands/community/marknextchangesetran.html Documentation}
	 */
	public markNextChangeSetRan(): void {
		this.run(LiquibaseCommands.MarkNextChangeSetRan);
	}

	/**
	 * The markNextChangeSetRanSQL command is a helper command that inspects the SQL Liquibase will run while using the markNextChangeSetRan command.
	 *
	 * @description The markNextChangeSetRanSQL command is used to inspect the raw SQL before running the markNextChangeSetRan command,
	 * so you can correct any issues that may arise before running the command. Liquibase uses the raw SQL to mark the next changeset you apply as executed in your database and to keep that changeset in the changelog as a record assuming that it has already been deployed.
	 *
	 * {@link https://docs.liquibase.com/commands/community/marknextchangesetransql.html Documentation}
	 */
	public markNextChangeSetRanSQL(): void {
		this.run(LiquibaseCommands.MarkNextChangeSetRanSql);
	}

	/**
	 * The registerChangeLog command connects your local Liquibase activity to a specific Liquibase Hub Project. By registering your changelog, this activity will be visible only to one Project within one Organization in Liquibase Hub.
	 *
	 * @description The registerChangeLog command is used to connect an XML or formatted SQL changelog to your Liquibase Hub Project. Also, you can use JSON and YAML changelog formats (since 4.2.1).
	 * The command also assigns the changeLogId to the changelog file that you register. The changeLogId is a unique identifier in your changelog, which is automatically added by the registerChangeLog command to provide real-time monitoring and reports.
	 * You can connect the needed changelog file with your existing project or create a new project from the CLI.
	 *
	 * {@link https://docs.liquibase.com/commands/community/registerchangelog.html Documentation}
	 */
	public registerChangeLog(): void {
		this.run(LiquibaseCommands.RegisterChangeLog);
	}

	/**
	 * releaseLocks removes the specific Liquibase lock record from the DATABASECHANGELOGLOCK table in the needed database.
	 *
	 * @description releaseLocks is typically used when there was an interruption with the Liquibase process during deployment resulting from the DATABASECHANGELOGLOCK table being in a locked state.
	 *
	 * {@link https://docs.liquibase.com/commands/community/releaselocks.html Documentation}
	 */
	public releaseLocks(): void {
		this.run(LiquibaseCommands.ReleaseLocks);
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
