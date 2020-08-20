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
}

const test = async() => {
  const repo = new UsersRepository("users.json");
  await repo.create({email: "test@test.com", password: "password"});
  const users = await repo.getAll();
  console.log(users);
};

test();
