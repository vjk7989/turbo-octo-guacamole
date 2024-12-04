import React from 'react';
import { Check, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getPendingRequests, approveRequest, rejectRequest } from '../utils/fileService';
import { DownloadRequest } from '../types/file';

export default function DownloadRequests() {
  const { user } = useAuthStore();
  const [requests, setRequests] = React.useState<DownloadRequest[]>([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      const pendingRequests = await getPendingRequests();
      setRequests(pendingRequests);
    };

    fetchRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    if (!user) return;
    const success = await approveRequest(requestId, user.id);
    if (success) {
      const updatedRequests = await getPendingRequests();
      setRequests(updatedRequests);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user) return;
    const success = await rejectRequest(requestId, user.id);
    if (success) {
      const updatedRequests = await getPendingRequests();
      setRequests(updatedRequests);
    }
  };

  if (!requests.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Pending Download Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{request.fileName}</p>
              <p className="text-sm text-gray-500">
                Requested by: {request.userId}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(request.requestDate).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(request.id)}
                className="p-2 text-green-600 hover:text-green-700 bg-green-50 rounded-full"
                title="Approve"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="p-2 text-red-600 hover:text-red-700 bg-red-50 rounded-full"
                title="Reject"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}