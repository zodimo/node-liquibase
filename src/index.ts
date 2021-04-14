#!/usr/bin/env node
import {spawn} from 'child_process';
import {join} from 'path';
import {LiquibaseCommands} from './enums/liquibase-commands.enum';
import {CalculateCheckSumCommandAttributes,
	LiquibaseConfig,
	UpdateCommandAttributes,
	ChangelogSyncToTagCommandAttributes,
	ChangelogSyncToTagSQLCommandAttributes,
	DbDocCommandAttributes,
	DiffChangelogCommandAttributes,
	DiffCommandAttributes} from './models/index';


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
 	*
 	* {@link https://docs.liquibase.com/commands/community/update.html Documentation}
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
	 * The changelogSync command marks all undeployed changes in your changelog as executed in your database.
	 *
	 * @description The changelogSync command is typically used when you want to baseline a new database environment.
	 * An example use case for the changelogSync command is when you have a DEV environment with a set of objects used only in DEV, and you want to use the same changelog to manage a new TEST environment.
	 * The TEST environment does not have or need, those DEV-only objects. To avoid deploying the DEV-only objects, you run the changelogSync command to mark those changes as executed in the DATABASECHANGELOG which tells Liquibase to treat these databases as equivalent.
	 * You can also use the changeLogSync command to mark a change as executed if the object associated with the change was created manually on the database. By marking the changeset as executed, it prevents the next Liquibase update from failing as it tries to create an object that already exists.
	 *
	 * {@link https://docs.liquibase.com/commands/community/changelogsync.html Documentation}
	 */
	public changelogSync(): void {
		this.run(LiquibaseCommands.ChangelogSync, {});
	}

	/**
	 * The changelogSyncSQL is a helper command that produces the raw SQL Liquibase would run when using the changelogSync command.
	 *
	 * @description The changelogSyncSQL command is typically used when you want to inspect the SQL Liquibase will use to baseline a new database environment.
	 * It is best practice to inspect any SQL that Liquibase would run when using the changelogSync command so you can review any changes the command would make to your database before running the command.
	 *
	 * {@link https://docs.liquibase.com/commands/community/changelogsyncsql.html Documentation}
	 */
	public changelogSyncSQL(): void {
		this.run(LiquibaseCommands.ChangelogSyncSql, {});
	}

	/**
	 * The changelogSyncToTag command marks all undeployed changesets from your changelog up to the specified tag as executed in your database. The command also marks the changeset with that tag as deployed.
	 *
	 * @param params Arguments/Attribute for the command.
	 *
	 * @description The changelogSyncToTag command is typically used when you want to baseline a new database environment with specific objects. An example use case for the changelogSyncToTag command is the following:
	 * 1. You have a DEV environment with a set of objects used only in DEV, and you want to use the same changelog to manage a new TEST environment. The TEST environment does not have those DEV-only objects and needs only some of them.
	 * 2. To deploy the needed DEV-only objects and avoid deploying the rest, you add a tag and run the changelogSyncToTag command to mark the changes related to that tag as executed in the DATABASECHANGELOG table.
	 * 3. The command marks all changesets starting with the first changeset at the top of the DEV changelog file and moving down to the changesets up to and including the tag.
	 * 4. Next, you deploy the changesets that were not marked as deployed in your database. Liquibase treats your DEV and TEST databases as equivalent.
	 *
	 * {@link https://docs.liquibase.com/commands/community/changelogsynctotag.html Documentation}
	 */
	public changelogSyncToTag(params: ChangelogSyncToTagCommandAttributes): void {
		this.run(LiquibaseCommands.ChangelogSyncToTag, params);
	}

	/**
	 * The changelogSyncToTagSQL is a helper command that produces the raw SQL that Liquibase would run when using the changelogSyncToTag command to mark all undeployed changesets associated with the specified tag as executed in your database.
	 *
	 * @param params Arguments/Attribute for the command.
	 *
	 * @description The changelogSyncToTagSQL command is typically used when you want to inspect the SQL Liquibase will use to baseline a new database environment.
	 * It is best practice to inspect any SQL that Liquibase would run when using the changelogSyncToTag command so you can review any changes the command would make to your database before running it.
	 * The changelogSyncToTag command marks all changesets starting with the first changeset at the top of the changelog file and moving down to the changeset up to and including the tag.
	 *
	 * {@link https://docs.liquibase.com/commands/community/changelogsynctotagsql.html Documentation}
	 */
	public changelogSyncToTagSQL(params: ChangelogSyncToTagSQLCommandAttributes): void {
		this.run(LiquibaseCommands.ChangelogSyncToTagSql, params);
	}

	/**
	 * The clearCheckSums clears all checksums and nullifies the MD5SUM column of the DATABASECHANGELOG table so they will be re-computed on the next database update.
	 *
	 * @description clearCheckSums is typically used when there is a [MD5Sum Check Failed] error message and there is a need to clear the checksums from the DATABASECHANGELOG table.
	 *
	 * {@link https://docs.liquibase.com/commands/community/clearchecksums.html Documentation}
	 */
	public clearCheckSums() {
		this.run(LiquibaseCommands.ClearCheckSums, {});
	}

	/**
	 * The dbDoc <outputDirectory> command generates documentation in a Javadoc format based on the existing database and changelogs.
	 *
	 * @param params Arguments/Attribute for the command.
	 *
	 * @description The dbDoc <outputDirectory> command is typically used to generate database documentation with the change information stored in the changelogs and the existing database.
	 * It captures the current state of your database including everything that has been performed against it.
	 *
	 * {@link https://docs.liquibase.com/commands/community/dbdoc.html Documentation}
	 */
	public dbDoc(params: DbDocCommandAttributes) {
		this.run(LiquibaseCommands.DbDoc, params);
	}

	/**
	 * The deactivateChangeLog command removes the changelogID from your changelog file so it stops sending reports to Liquibase Hub.
	 *
	 * @description The deactivateChangeLog command is typically used when:
	 * 1. You start using Liquibase Hub to keep a history of all your activity, but you have registered the wrong changelog file and want to keep it from reporting the activity to Liquibase Hub.
	 * 2. You use a changelog file that is being secluded or refactored into other changelogs and do not want more than one source of changesets reporting to Liquibase Hub.
	 * When you run the deactivateChangeLog command, it modifies a specific changelog file by removing changelogID to prevent it from sending the data. The command differs from the liquibase.hub.mode=off property, which is set in your defaults file (the liquibase.properties file) or passed as a JAVA property and prevents any changelog from sending data.
	 *
	 * {@link https://docs.liquibase.com/commands/community/deactivatechangelog.html Documentation}
	 */
	public deactivateChangeLog() {
		this.run(LiquibaseCommands.DeactivateChangeLog, {});
	}

	/**
	 * The diff command in Liquibase allows you to compare two databases of the same type, or different types, to one another.
	 *
	 * @param params Arguments/Attribute for the command.
	 *
	 * @description The diff command is typically used at the completion of a project to verify all expected changes are in the changelog or to detect drift between a model schema and a database's actual schema.
	 * The diff command is also useful for the following tasks:
	 * 1. Finding missing objects between one database and another
	 * 2. Seeing that a change was made to your database
	 * 3. Finding unexpected items in your database
	 *
	 * {@link https://docs.liquibase.com/commands/community/diff.html Documentation}
	 */
	public diff(params: DiffCommandAttributes) {
		this.run(LiquibaseCommands.Diff, params);
	}

	/**
	 * The diffChangeLog command allows you to receive information on differences between two databases you are comparing and creates a changelog file containing deployable changesets.
	 * The diffChangeLog command points out the differences in general and generates changes to resolve most of them.
	 *
	 * @param params Arguments/Attribute for the command.
	 *
	 * @description The diffChangeLog command is typically used when you want to create a deployable changelog to synchronize multiple databases.
	 * The diffChangeLog command also provides more information about:
	 * 1. Missing objects in your database
	 * 2. Changes made to your database
	 * 3. Unexpected items in your database
	 *
	 * {@link https://docs.liquibase.com/commands/community/diffchangelog.html}
	 */
	public diffChangelog(params: DiffChangelogCommandAttributes) {
		this.run(LiquibaseCommands.DiffChangeLog, params);
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
	private run(action: LiquibaseCommands, params: { [key: string]: any }) {
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
