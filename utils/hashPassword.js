import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

export const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const comparePasswords = (inputPassword, hashedPassword) =>
  bcrypt.compareSync(inputPassword, hashedPassword);

// module.exports = { hashPassword, comparePasswords };
