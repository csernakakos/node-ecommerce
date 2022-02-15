const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repo requires a file name.")
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, "[]")
        }
    }

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename, {encoding: "utf8"}));
    }

    async create(attributes){
        const records = await this.getAll();
        attributes.id = this.generateId();
        records.push(attributes);
        await this.writeAll(records);
        
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    generateId(){
        return "_" + crypto.randomBytes(4).toString("hex");
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id){
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async getOneBy(filters){
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }

    async update(id, attributes){
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with ${id} not found.`)
        }

        Object.assign(record, attributes);
        await this.writeAll(records);
    }

}

module.exports = new UsersRepository("users.json");