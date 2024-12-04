import React from 'react';
import { FileText, Download, Trash2, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getAllFiles, requestDownload, getFileContent, deleteFile } from '../utils/fileService';
import { FileEntry } from '../types/file';
import { dbService } from '../utils/db';

export default function FileList() {
  const { user } = useAuthStore();
  const [files, setFiles] = React.useState<FileEntry[]>([]);
  const [downloadStatus, setDownloadStatus] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allFiles = await getAllFiles();
      setFiles(allFiles);

      // Get download request status for each file
      if (user) {
        const statuses: Record<string, string> = {};
        for (const file of allFiles) {
          const request = await dbService.downloadRequests.findByFileAndUser(file.id, user.id);
          if (request) {
            statuses[file.id] = request.status;
          }
        }
        setDownloadStatus(statuses);
      }
    } catch (err) {
      setError('Failed to load files. Please try again later.');
      console.error('Error fetching files:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownloadRequest = async (fileId: string) => {
    if (!user) return;
    try {
      const success = await requestDownload(fileId, user.id);
      if (success) {
        setDownloadStatus(prev => ({ ...prev, [fileId]: 'pending' }));
      }
    } catch (err) {
      console.error('Error requesting download:', err);
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const content = await getFileContent(fileId);
      if (!content) return;

      const file = files.find(f => f.id === fileId);
      if (!file) return;

      const blob = new Blob([atob(content)], { type: file.contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles(files.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const canDownload = (file: FileEntry) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (file.userId === user.id) return true;
    return downloadStatus[file.id] === 'approved';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Files</h2>
      {files.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No files uploaded yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-blue-600" />
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-gray-500">{file.description}</p>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete file"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                {canDownload(file) ? (
                  <button
                    onClick={() => handleDownload(file.id)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownloadRequest(file.id)}
                    disabled={downloadStatus[file.id] === 'pending' || downloadStatus[file.id] === 'rejected'}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                  >
                    <Clock size={16} />
                    <span>
                      {downloadStatus[file.id] === 'pending'
                        ? 'Request Pending'
                        : downloadStatus[file.id] === 'rejected'
                        ? 'Request Rejected'
                        : 'Request Download'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}