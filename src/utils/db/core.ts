import { openDB } from 'idb';
import { AppDB } from './schema';

let dbPromise: Promise<IDBPDatabase<AppDB>>;

export const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>('file-management-system', 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('by-username', 'username', { unique: true });
          
          // Add default admin user
          transaction.objectStore('users').put({
            id: '1',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Admin User',
            email: 'admin@example.com'
          });
        }

        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('by-status', 'status');
        }

        if (!db.objectStoreNames.contains('download_requests')) {
          const requestStore = db.createObjectStore('download_requests', { keyPath: 'id' });
          requestStore.createIndex('by-status', 'status');
          requestStore.createIndex('by-file-user', ['fileId', 'userId']);
        }

        // Ensure all required indexes exist
        const requestStore = transaction.objectStore('download_requests');
        if (!requestStore.indexNames.contains('by-status')) {
          requestStore.createIndex('by-status', 'status');
        }
        if (!requestStore.indexNames.contains('by-file-user')) {
          requestStore.createIndex('by-file-user', ['fileId', 'userId']);
        }
      }
    });
  }
  return dbPromise;
};