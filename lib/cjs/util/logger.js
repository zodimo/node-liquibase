"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var constants_1 = require("../constants");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function (message) {
        console.log(constants_1.LIQUIBASE_LABEL + " " + message);
    };
    Logger.warn = function (message) {
        console.warn('\x1b[33m%s\x1b[0m', constants_1.LIQUIBASE_LABEL + " " + message);
    };
    Logger.error = function (message) {
        console.error('\x1b[31m%s\x1b[0m', constants_1.LIQUIBASE_LABEL + " " + message);
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map