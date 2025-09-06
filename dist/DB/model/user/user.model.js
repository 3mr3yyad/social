"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./user.schema");
exports.User = (0, mongoose_1.model)("User", user_schema_1.userSchema);
