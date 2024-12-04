import { FileEntry, DownloadRequest } from '../types/file';
import { dbService } from './db';

export const saveFile = async (file: Omit<FileEntry, 'id' | 'createdAt' | 'status'>): Promise<FileEntry> => {
  return dbService.files.insert({
    ...file,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
};

export const getAllFiles = async (): Promise<FileEntry[]> => {
  return dbService.files.findAll();
};

export const getFileContent = async (fileId: string): Promise<string | null> => {
  const file = await dbService.files.findById(fileId);
  return file?.content || null;
};

export const requestDownload = async (fileId: string, userId: string): Promise<boolean> => {
  try {
    await dbService.downloadRequests.insert({
      fileId,
      userId,
      requestDate: new Date().toISOString(),
      status: 'pending'
    });
    return true;
  } catch (error) {
    console.error('Error requesting download:', error);
    return false;
  }
};

export const getPendingRequests = async (): Promise<(DownloadRequest & { fileName: string })[]> => {
  const [requests, files] = await Promise.all([
    dbService.downloadRequests.findPending(),
    dbService.files.findAll()
  ]);
  
  return requests.map(request => ({
    ...request,
    fileName: files.find(f => f.id === request.fileId)?.name || 'Unknown file'
  }));
};

export const approveRequest = async (requestId: string, adminId: string): Promise<boolean> => {
  return dbService.downloadRequests.update(requestId, {
    status: 'approved',
    reviewDate: new Date().toISOString(),
    reviewedBy: adminId
  });
};

export const rejectRequest = async (requestId: string, adminId: string): Promise<boolean> => {
  return dbService.downloadRequests.update(requestId, {
    status: 'rejected',
    reviewDate: new Date().toISOString(),
    reviewedBy: adminId
  });
};

export const deleteFile = async (id: string): Promise<boolean> => {
  return dbService.files.delete(id);
};