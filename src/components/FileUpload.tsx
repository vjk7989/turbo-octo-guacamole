import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { saveFile } from '../utils/fileService';

export default function FileUpload() {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    try {
      setIsUploading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        
        await saveFile({
          userId: user.id,
          uploadedBy: user.name,
          name: fileName || selectedFile.name,
          description,
          content: content.split(',')[1], // Remove data URL prefix
          contentType: selectedFile.type,
        });

        setShowModal(false);
        setFileName('');
        setDescription('');
        setSelectedFile(null);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        <Upload size={20} />
        <span>Upload File</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload File</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File Name (optional)
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder={selectedFile?.name}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}