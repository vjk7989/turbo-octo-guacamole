import { FileEntry } from '../../types/file';
import { getDB } from './core';

export const fileService = {
  async findAll() {
    const db = await getDB();
    return db.getAll('files');
  },

  async findById(id: string) {
    const db = await getDB();
    return db.get('files', id);
  },

  async insert(file: Omit<FileEntry, 'id'>) {
    const db = await getDB();
    const id = crypto.randomUUID();
    const newFile = { ...file, id };
    await db.put('files', newFile);
    return newFile;
  },

  async delete(id: string) {
    const db = await getDB();
    await db.delete('files', id);
    return true;
  }
};