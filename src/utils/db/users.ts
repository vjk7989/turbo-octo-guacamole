import { UserWithPassword } from '../../types/auth';
import { getDB } from './core';

export const userService = {
  async findAll() {
    const db = await getDB();
    return db.getAll('users');
  },

  async findByUsername(username: string) {
    const db = await getDB();
    return db.getFromIndex('users', 'by-username', username);
  },

  async findById(id: string) {
    const db = await getDB();
    return db.get('users', id);
  },

  async insert(user: Omit<UserWithPassword, 'id'>) {
    const db = await getDB();
    const id = crypto.randomUUID();
    const newUser = { ...user, id };
    await db.put('users', newUser);
    return newUser;
  },

  async updatePassword(id: string, password: string) {
    const db = await getDB();
    const user = await db.get('users', id);
    if (user) {
      await db.put('users', { ...user, password });
      return true;
    }
    return false;
  },

  async delete(id: string) {
    const db = await getDB();
    await db.delete('users', id);
    return true;
  }
};