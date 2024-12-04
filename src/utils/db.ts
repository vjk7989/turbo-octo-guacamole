import { userService } from './db/users';
import { fileService } from './db/files';
import { requestService } from './db/requests';

export const dbService = {
  users: userService,
  files: fileService,
  downloadRequests: requestService
};