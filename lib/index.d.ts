#!/usr/bin/env node
import { LiquibaseConfig } from './models/liquibase-config.model';
import { UpdateCommandAttributes } from './models/update-command-attributes.model';
export declare class Liquibase {
    private params;
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
    constructor(params: LiquibaseConfig);
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
    update(params: UpdateCommandAttributes): void;
    private stringifyParams;
    /**
     * LEGACY CODE START
     */
    /**
     * Spawns a Liquibase command.
     * @param {*} action a string for the Liquibase command to run. Defaults to `'update'`
     * @param {*} params any parameters for the command
     * @returns {Promise} Promise of a node child process.
     */
    private run;
    /**
     * Internal Getter that returns a node child process compatible command string.
     * @returns {string}
     * @private
     */
    private get liquibasePathAndGlobalAttributes();
    /**
     *
     * Internal method for executing a child process.
     * @param {*} commandString Liquibase commandString
     */
    private spawnChildProcess;
    private mergeParamsWithDefaults;
}
