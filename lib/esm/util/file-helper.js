"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelper = void 0;
var path_1 = require("path");
var FileHelper = /** @class */ (function () {
    function FileHelper() {
    }
    Object.defineProperty(FileHelper, "bundledLiquibasePath", {
        get: function () {
            if (process.env.NODE_ENV === 'test') {
                return this.bundledLiquibasePathForInternalConsumers;
            }
            return this.bundledLiquibasePathForExternalConsumers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileHelper, "bundledLiquibasePathForExternalConsumers", {
        get: function () {
            var liquibaseExecutablePath = path_1.join(__dirname, '../../liquibase/liquibase');
            return liquibaseExecutablePath;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileHelper, "bundledLiquibasePathForInternalConsumers", {
        get: function () {
            var liquibaseExecutablePath = path_1.join(__dirname, '../../bin/liquibase/liquibase');
            return liquibaseExecutablePath;
        },
        enumerable: false,
        configurable: true
    });
    return FileHelper;
}());
exports.FileHelper = FileHelper;
//# sourceMappingURL=file-helper.js.map