"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
var child_process_1 = require("child_process");
var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
    }
    CommandHandler.spawnChildProcess = function (commandString) {
        console.log("Running " + commandString + "...");
        // let child;
        var promise = new Promise(function (resolve, reject) {
            child_process_1.exec(commandString, function (error, stdout, stderr) {
                console.log('\n', stdout);
                if (error) {
                    console.error('\n', stderr);
                    // error.stderr = stderr;
                    return reject(error);
                }
                resolve(stdout);
            });
        });
        // promise.child = child;
        return promise;
    };
    return CommandHandler;
}());
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=command-handler.js.map