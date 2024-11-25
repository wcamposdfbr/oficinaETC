// @ts-check

const crypto = require("crypto");

function MemoryRepository() {
  this.users = [];
}

MemoryRepository.prototype.create = async function ({ user }) {
  user.id = crypto.randomBytes(8).toString("hex");
  this.users.push(user);
  return user;
};

MemoryRepository.prototype.list = async function () {
  return this.users;
};

MemoryRepository.prototype.findById = async function ({ userId }) {
  const user = this.users.find((user) => user.id === userId);
  if (!user) {
    throw new Error("Could not find user");
  }
  return user;
};

MemoryRepository.prototype.update = async function name({ userId, user }) {
  const oldUser = this.users.find((user) => user.id === userId);
  if (!oldUser) {
    throw new Error("Could not find user");
  }
  Object.assign(oldUser, user);

  return user;
};

MemoryRepository.prototype.delete = async function ({ userId }) {
  this.users = this.users.filter((user) => user.id !== userId);
};

module.exports = MemoryRepository;
