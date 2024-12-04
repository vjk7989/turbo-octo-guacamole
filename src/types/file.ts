export interface FileEntry {
  id: string;
  userId: string;
  name: string;
  description: string;
  content: string;
  contentType: string;
  createdAt: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy?: string;
  requestDate?: string;
}

export interface DownloadRequest {
  id: string;
  fileId: string;
  userId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewDate?: string;
  reviewedBy?: string;
}