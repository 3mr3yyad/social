"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        const doc = new this.model(item);
        return await doc.save();
    }
    async getOne(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    async exists(filter, projection, options) {
        return await this.model.findOne(filter, projection, options);
    }
    async update(filter, update, options) {
        return await this.model.updateOne(filter, update, options);
    }
    async delete(filter) {
        return await this.model.deleteOne(filter);
    }
}
exports.AbstractRepository = AbstractRepository;
