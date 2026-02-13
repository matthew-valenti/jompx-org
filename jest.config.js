"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jest_1 = require("@nx/jest");
exports.default = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return ({
        projects: yield (0, jest_1.getJestProjectsAsync)(),
    });
});
//# sourceMappingURL=jest.config.js.map