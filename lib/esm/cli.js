#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var util_1 = require("./util");
var args = process.argv.slice(2);
var commandString = getCommandString(args);
util_1.CommandHandler.spawnChildProcess(commandString);
function getCommandString(args) {
    var argsWereProvided = (args === null || args === void 0 ? void 0 : args.length) > 0;
    if (!argsWereProvided) {
        throw new Error('CLI call signature does not match the expected format. Please verify you have passed required arguments and parameters.');
    }
    var firstArg = args[0];
    var firstArgWasAKnownCommand = Object.values(enums_1.LiquibaseCommands).includes(firstArg);
    var firstArgWasAFlag = firstArg.substr(0, 2) === '--';
    /**
     * This allows us to support a Liquibase-core-like syntax (i think?).
     *
     * Basically if we recognize the first arg as a command or a flag we can be relatively certain they didn't give us a filepath to an alternative liquibase executable.
     * In that case, we provide the `'liquibase'` string to follow normal behavior.
     */
    if (firstArgWasAKnownCommand || firstArgWasAFlag) {
        args.unshift(util_1.FileHelper.bundledLiquibasePath);
    }
    return args.join(' ');
}
//# sourceMappingURL=cli.js.map