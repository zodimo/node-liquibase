#!/usr/bin/env node
import { spawn } from 'child_process';
import { join } from 'path';
import { LiquibaseCommands } from './enums/liquibase-commands.enum';
var Liquibase = /** @class */ (function () {
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
    function Liquibase(params) {
        this.params = params;
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
    Liquibase.prototype.update = function (params) {
        this.run(LiquibaseCommands.Update, params);
    };
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
    Liquibase.prototype.calculateCheckSum = function (params) {
        this.run(LiquibaseCommands.CalculateCheckSum, params);
    };
    Liquibase.prototype.stringifyParams = function (params) {
        var commandString = '';
        for (var property in params) {
            var targetValue = params[property];
            commandString += "--" + property + "=" + JSON.stringify(targetValue) + " ";
        }
        return commandString;
    };
    /**
     * LEGACY CODE START
     */
    /**
     * Spawns a Liquibase command.
     * @param {*} action a string for the Liquibase command to run. Defaults to `'update'`
     * @param {*} params any parameters for the command
     * @returns {Promise} Promise of a node child process.
     */
    Liquibase.prototype.run = function (action, params) {
        var paramString = this.stringifyParams(params);
        return this.spawnChildProcess(this.liquibasePathAndGlobalAttributes + " " + action + " " + paramString);
    };
    Object.defineProperty(Liquibase.prototype, "liquibasePathAndGlobalAttributes", {
        /**
         * Internal Getter that returns a node child process compatible command string.
         * @returns {string}
         * @private
         */
        get: function () {
            var _this = this;
            var liquibasePathAndGlobalAttributes = "" + this.params.liquibase;
            Object.keys(this.params).forEach(function (key) {
                if (key === 'liquibase') {
                    return;
                }
                var value = _this.params[key];
                liquibasePathAndGlobalAttributes = liquibasePathAndGlobalAttributes + " --" + key + "=" + value;
            });
            return liquibasePathAndGlobalAttributes;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * Internal method for executing a child process.
     * @param {*} commandString Liquibase commandString
     */
    Liquibase.prototype.spawnChildProcess = function (commandString) {
        console.log("Running " + commandString + "...");
        return new Promise(function (resolve, reject) {
            var spawnedChild = spawn(commandString);
            spawnedChild.on('error', function (err) {
                return reject(err);
            });
            spawnedChild.on('close', function (code) {
                console.log("Exited with code " + code);
                return resolve(code);
            });
            spawnedChild.stdout.on('data', function (standardOutput) {
                console.log('\n', standardOutput);
            });
            spawnedChild.stderr.on('data', function (standardError) {
                console.error('\n', standardError);
            });
        });
    };
    Liquibase.prototype.mergeParamsWithDefaults = function (params) {
        var defaultParams = {
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
    };
    return Liquibase;
}());
export { Liquibase };
//# sourceMappingURL=index.js.map