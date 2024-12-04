import React from 'react';
import { useAuthStore } from '../store/authStore';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import DownloadRequests from '../components/DownloadRequests';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
          <FileUpload />
        </div>
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Username:</span> {user?.username}
            </p>
          </div>
        </div>
        {user?.role === 'admin' && <DownloadRequests />}
        <FileList />
      </div>
    </div>
  );
}