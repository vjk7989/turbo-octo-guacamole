import { DownloadRequest } from '../../types/file';
import { getDB } from './core';

export const requestService = {
  async findAll() {
    const db = await getDB();
    return db.getAll('download_requests');
  },

  async findById(id: string) {
    const db = await getDB();
    return db.get('download_requests', id);
  },

  async findPending() {
    const db = await getDB();
    return db.getAllFromIndex('download_requests', 'by-status', 'pending');
  },

  async findByFileAndUser(fileId: string, userId: string) {
    const db = await getDB();
    return db.getFromIndex('download_requests', 'by-file-user', [fileId, userId]);
  },

  async insert(request: Omit<DownloadRequest, 'id'>) {
    const db = await getDB();
    const id = crypto.randomUUID();
    const newRequest = { ...request, id };
    await db.put('download_requests', newRequest);
    return newRequest;
  },

  async update(id: string, data: Partial<DownloadRequest>) {
    const db = await getDB();
    const request = await db.get('download_requests', id);
    if (request) {
      await db.put('download_requests', { ...request, ...data });
      return true;
    }
    return false;
  }
};