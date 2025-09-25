"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACTION = exports.USER_AGENT = exports.GENDER = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE[SYS_ROLE["user"] = 0] = "user";
    SYS_ROLE[SYS_ROLE["admin"] = 1] = "admin";
    SYS_ROLE[SYS_ROLE["superAdmin"] = 2] = "superAdmin";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
var GENDER;
(function (GENDER) {
    GENDER[GENDER["male"] = 0] = "male";
    GENDER[GENDER["female"] = 1] = "female";
})(GENDER || (exports.GENDER = GENDER = {}));
var USER_AGENT;
(function (USER_AGENT) {
    USER_AGENT[USER_AGENT["google"] = 0] = "google";
    USER_AGENT[USER_AGENT["local"] = 1] = "local";
})(USER_AGENT || (exports.USER_AGENT = USER_AGENT = {}));
var REACTION;
(function (REACTION) {
    REACTION[REACTION["like"] = 0] = "like";
    REACTION[REACTION["love"] = 1] = "love";
    REACTION[REACTION["haha"] = 2] = "haha";
    REACTION[REACTION["wow"] = 3] = "wow";
    REACTION[REACTION["sad"] = 4] = "sad";
    REACTION[REACTION["angry"] = 5] = "angry";
})(REACTION || (exports.REACTION = REACTION = {}));
