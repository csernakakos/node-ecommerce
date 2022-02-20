const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository")

class UsersRepository extends Repository {
    async create(attributes){
        attributes.id = this.generateId();

        const salt = crypto.randomBytes(8).toString("hex");
        const hashedBuff = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${hashedBuff.toString("hex")}+${salt}`
        }

        records.push(record);

        await this.writeAll(records);
        return record;
    }

    async comparePasswords(pwSavedInDB, pwFromLoginSession) {
        const result = pwSavedInDB.split("+");
        const hashed = result[0];
        const salt = result[1];
        // Destructuring way:
        // const [hashed, salt] = pwSavedInDB.split("+");

        const hashedPwFromLoginSessionBuff = await scrypt(pwFromLoginSession, salt, 64);

        return hashed === hashedPwFromLoginSessionBuff.toString("hex");
    }
   
}

module.exports = new UsersRepository("users.json");