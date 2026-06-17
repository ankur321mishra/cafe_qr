import bcrypt from 'bcryptjs';
import config from '../config/index.js';

/**
 * Hash a plain text password with bcrypt.
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, config.bcrypt.saltRounds);
}

/**
 * Compare a plain text password against a bcrypt hash.
 */
export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}
