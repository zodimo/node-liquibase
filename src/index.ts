#!/usr/bin/env node
import { spawn } from 'child_process';
import { join } from 'path';
import {LiquibaseCommands} from './enums/liquibase-commands.enum';
import {
	LiquibaseConfig,
	CalculateCheckSumCommandAttributes,
	UpdateCommandAttributes,
	RollbackCommandAttributes,
	RollbackSQLCommandAttributes,
	RollbackCountCommandAttributes,
	RollbackCountSQLCommandAttributes,
	RollbackToDateCommandAttributes,
	RollbackToDateSQLCommandAttributes,
	SnapshotCommandAttributes,
	SnapshotReferenceCommandAttributes,
	SyncHubCommandAttributes,
	TagCommandAttributes,
	TagExistsCommandAttributes
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
	calculateCheckSum(params: CalculateCheckSumCommandAttributes) {
		this.run(LiquibaseCommands.CalculateCheckSum, params);
	}

	/**
	 * The rollback <tag> command rolls back changes made to the database based on the specified tag.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollback <tag> command is typically used to revert all changes that were made to the database after the tag you specify.
	 * When you run rollback <tag>, Liquibase will roll back sequentially all the deployed changes until it reaches the tag row in the DATABASECHANGELOG table.
	 * For example, you can use the rollback <tag> command when you want to undo a series of changes made to your database related to a specific tag such as a numbered release.
	 * If you have tags for release 1, release 2, and release 3, and need to make a correction in release 2, the rollback <tag> command will rollback release 3 first.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbackbytag.html}
	 */
	rollback(params: RollbackCommandAttributes) {
		this.run(LiquibaseCommands.Rollback, params);
	}

	/**
	 * The rollbackSQL <tag> is a helper command that produces the raw SQL Liquibase would run when using the rollback<tag> command.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollbackSQL <tag> command is typically used to inspect the SQL Liquibase uses to revert changes associated with a tag you specify when you run the rollback <tag> command.
	 * It is best practice to use the rollbackSQL <tag> command before running the rollback <tag> command to ensure that you eliminate any potential risks.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbacksqltag.html}
	 */
	rollbackSQL(params: RollbackSQLCommandAttributes) {
		this.run(LiquibaseCommands.RollbackSql, params);
	}

	/**
	 * The rollbackCount <value> command reverts a specified number of changesets, where <value> is the number of changesets you want to revert sequentially on your database.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollbackCount <value> command is used when you want to roll back changes sequentially,
	 * starting with the most recent changes and working backward until the value specified is reached.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbackcount.html}
	 */
	rollbackCount(params: RollbackCountCommandAttributes) {
		this.run(LiquibaseCommands.RollbackCount, params);
	}

	/**
	 * The rollbackCountSQL <value> command is a helper command that allows you to inspect the SQL Liquibase will run while using the rollbackCount <value> command.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollbackCountSQL <value> command is used when you want to inspect the raw SQL before running the rollbackCount <value> command,
	 * so you can correct any issues that may arise before running the command.
	 * Liquibase uses the raw SQL to revert any changesets between the most recent and the value you specified.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbackcountsql.html}
	 */
	rollbackCountSQL(params: RollbackCountSQLCommandAttributes) {
		this.run(LiquibaseCommands.RollbackCountSql, params);
	}

	/**
	 * The rollbackToDate command reverts your database to the state it was in at the date and time you specify.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollbackToDate command is mainly used when you want to revert all changes made to your database from today's date to the date and time you specify.
	 * The rollbackToDate command reverts those changesets to their previous state and allows you to target the date and time without impacting changes or deployments that came before the date and time you specified.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbacktodate.html}
	 */
	rollbackToDate(params: RollbackToDateCommandAttributes) {
		this.run(LiquibaseCommands.RollbackToDate, params);
	}

	/**
	 * The rollbackToDateSQL command is a helper command that allows you to inspect the SQL Liquibase will run while using the rollbackToDate command.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The rollbackToDateSQL command is typically used when you want to inspect the raw SQL before running the rollbackToDate command,
	 * so you can correct any issues that may arise before running the command.
	 *
	 * {@link https://docs.liquibase.com/commands/community/rollbacktodatesql.html}
	 */
	rollbackToDateSQL(params: RollbackToDateSQLCommandAttributes) {
		this.run(LiquibaseCommands.RollbackToDateSql, params);
	}

	/**
	 * The snapshot command captures the current state of the URL database, which is the target database.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The snapshot command is typically used when you want to see changes in your target database or keep a record of your current database state.
	 *
	 * The snapshot command has two modes:
	 * - When run without options, it gathers the current state of the database and shows a text-based version of the schema to STDOUT.
	 * - When run with the --snapshotFormat=JSON option, it creates a JSON file that represents the current state of the URL database.
	 * Alternatively, you can have a YAML-based output by using the --snapshotFormat=yaml attribute.
	 *
	 * {@link https://docs.liquibase.com/commands/community/snapshot.html}
	 */
	snapshot(params: SnapshotCommandAttributes) {
		this.run(LiquibaseCommands.Snapshot, params);
	}

	/**
	 * The snapshotReference command captures the current state of the referenceURL database, which is the source database.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The snapshotReference command is typically used when you want to see changes in your source database or keep a record of your current database state.
	 *
	 * The snapshot command has two modes:
	 * - When run without options, it gathers the current state of the database and shows a text-based version of the schema to STDOUT.
	 * - When run with the --snapshotFormat=JSON option, it creates a JSON file that represents the current state of the referenceURL database.
	 * Alternatively, you can have a YAML-based output by using the --snapshotFormat=yaml attribute.
	 *
	 * {@link https://docs.liquibase.com/commands/community/snapshotreference.html}
	 */
	snapshotReference(params: SnapshotReferenceCommandAttributes) {
		this.run(LiquibaseCommands.SnapshotReference, params);
	}

	/**
	 * The status --verbose command produces a list of pending changesets with additional information that includes the id, author, and file path name.
	 * The status --verbose command does not modify the database.
	 *
	 * @description The status --verbose command is typically used when changesets were added to a changelog through source control by another developer.
	 * The command confirms what has been deployed and what changesets are pending per author and corresponding ids.
	 *
	 * {@link https://docs.liquibase.com/commands/community/status-verbose.html}
	 */
	status() {
		this.run(LiquibaseCommands.Status);
	}

	/**
	 * The syncHub command synchronizes the local DATABASECHANGELOG table with Liquibase Hub.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The syncHub command is typically used when you want to:
	 * - Ensure that Liquibase Hub shows the latest results from your DATABASECHANGELOG table.
	 * - Synchronize the DATABASECHANGELOG table of a new project that has pre-existing data in the DATABASECHANGELOG table.
	 * - Synchronize your local data if update, rollback, changelogSync, or dropAll were run while Liquibase Hub was offline.
	 *
	 * When you run the syncHub command, you will not see any operations added to the Project associated with your changelog.
	 * syncHub cannot associate previous Liquibase operations, so you will not see any operations in Liquibase Hub.
	 * You will only see changesets added to the changesets tab in your Liquibase Hub project.
	 *
	 * {@link https://docs.liquibase.com/commands/community/synchub.html}
	 */
	syncHub(params: SyncHubCommandAttributes) {
		this.run(LiquibaseCommands.SyncHub, params);
	}

	/**
	 * The tag <tag string> command marks the current database state so you can roll back changes in the future.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The tag <tag string> command is typically used to mark the current database state, version, release, or any other information by adding the tag to the last row in the DATABASECHANGELOG table.
	 * After setting the tag, you can use the rollback <tag> command to roll back all changes under this tag.
	 *
	 * {@link https://docs.liquibase.com/commands/community/tag.html}
	 */
	tag(params: TagCommandAttributes) {
		this.run(LiquibaseCommands.Tag, params);
	}

	/**
	 * The tagExists <tag string> command checks whether the tag you specify already exists in your database.
	 *
	 * @param params - Arguments/Attribute for the command.
	 *
	 * @description The tagExists <tag string> command is typically used to identify whether the specified tag exists in the database or specifically in the DATABASECHANGELOG table.
	 * Running the tagExists <tag string> command checks for the tag and, based on whether it exists or not, provides the appropriate output.
	 *
	 * {@link https://docs.liquibase.com/commands/community/tagexists.html}
	 */
	tagExists(params: TagExistsCommandAttributes) {
		this.run(LiquibaseCommands.TagExists, params);
	}

	/**
	 * The unexpectedChangeSets command produces a list of changesets that were run in the database but do not exist in the current changelog.
	 *
	 * @description The unexpectedChangeSets command is typically used to detect and compare the changes between the DATABASECHANGELOG table and the current changelog.
	 * If any of the changesets in the DATABASECHANGELOG table do not exist in the current changelog, the unexpectedChangeSets command will detect those changesets and produce them in your output.
	 *
	 * The unexpectedChangeSets command also produces all the changesets that were previously deployed and deleted from your current changelog.
	 *
	 * {@link https://docs.liquibase.com/commands/community/unexpectedchangesets.html}
	 */
	unexpectedChangeSets() {
		this.run(LiquibaseCommands.UnexpectedChangeSets);
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
