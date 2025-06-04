import * as crypto from "crypto";

/**
 * 生成随机盐值
 * @param len - Length of the salt to be generated, default is 6
 * @description Generates a random salt of specified length using Node.js crypto module.
 * The salt is generated as a base64 encoded string.
 * @returns 
 */
export function generateSalt(len = 6) {
  return crypto.randomBytes(len).toString("base64")
}

export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    throw new Error("Password and salt must be provided");
  }
  const tempSalt = Buffer.from(salt, "base64"); // 确保盐值是正确的格式
  const passwordHash = crypto.pbkdf2Sync(password, tempSalt, 10000, 16, "sha1").toString("base64");
  // 将密码和盐值组合后进行哈希处理
  return passwordHash;
}