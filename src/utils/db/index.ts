import { userService } from './users';
import { fileService } from './files';
import { requestService } from './requests';

export const dbService = {
  users: userService,
  files: fileService,
  downloadRequests: requestService
};