import { DBSchema } from 'idb';
import { FileEntry, DownloadRequest } from '../../types/file';
import { UserWithPassword } from '../../types/auth';

export interface AppDB extends DBSchema {
  users: {
    key: string;
    value: UserWithPassword;
    indexes: { 'by-username': string };
  };
  files: {
    key: string;
    value: FileEntry;
    indexes: { 'by-status': string };
  };
  download_requests: {
    key: string;
    value: DownloadRequest;
    indexes: {
      'by-status': string;
      'by-file-user': [string, string];
    };
  };
}