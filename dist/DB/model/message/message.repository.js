"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const message_model_1 = require("./message.model");
class MessageRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(message_model_1.Message);
    }
}
exports.MessageRepository = MessageRepository;
