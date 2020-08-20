const fs = require("fs");
const crypto = require('crypto');

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
    // open the file and read the content
    return JSON.parse(await fs.promises.readFile(this.filename, {encoding: "utf-8"}));
  }

  async create(usr) {
    usr.id = this.randomId();
    const records = await this.getAll();
    records.push(usr);
    this.writeAll(records);
  }

  async writeAll(records) {
    await fs
      .promises
      .writeFile(this.filename, JSON.stringify(records, null, 1));
  }

  randomId() {
    return crypto
      .randomBytes(4)
      .toString('hex');
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find(record => record.id === id)
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecord = records.filter(record => record.id !== id);
    await this.writeAll(filteredRecord);

  }

  async update(id, attr) {
    const records = await this.getAll();
    const record = records.find(record => record.id === id)
    if (!record) {
      throw new Error(`Record with id ${id} not found`)
    }
    Object.assign(record, attr);
    await this.writeAll(records)
  }
}

const test = async() => {
  const repo = new UsersRepository("users.json");
  // await repo.create({email: "test5@test.com", password: "password"}); const
  // users = await repo.getAll(); const user = await repo.getOne('10776556')
  // console.log(user); await repo.delete('8ad87433')
  await repo.update('cc0add86', {"email": "test6@test.com"})
  const users = await repo.getAll()
  console.log(users)

};

test();
