"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const chat_model_1 = require("./chat.model");
class ChatRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(chat_model_1.Chat);
    }
}
exports.ChatRepository = ChatRepository;
