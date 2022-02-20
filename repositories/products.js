const fs = require("fs");
const Repository = require("../repositories/repository")

class ProductsRepository extends Repository {
    async create(attributes){
        attributes.id = this.generateId();

        const records = await this.getAll();
        records.push(attributes);

        await this.writeAll(records);

        return attributes;
    }

}

module.exports = new ProductsRepository("products.json");