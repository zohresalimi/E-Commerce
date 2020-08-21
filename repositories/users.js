const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creat a repository requires filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf-8" })
    );
  }

  async create(usr) {
    usr.id = this.randomId();
    const records = await this.getAll();
    records.push(usr);
    this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 1)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecord = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecord);
  }

  async update(id, attr) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(record, attr);
    await this.writeAll(records);
  }

  async getOnBy(obj) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in obj) {
        if (record[key] !== obj[key]) {
          found = false;
        }
      }
      if (found) return record;
    }
  }
}

module.exports = new UsersRepository("users.json");
