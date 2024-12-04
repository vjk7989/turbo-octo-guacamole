import React from 'react';
import { FileDown } from 'lucide-react';
import { downloadReport } from '../utils/fileService';

export default function FileReport() {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => downloadReport('xlsx')}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        <FileDown size={20} />
        <span>Download Excel Report</span>
      </button>
      <button
        onClick={() => downloadReport('json')}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        <FileDown size={20} />
        <span>Download JSON Report</span>
      </button>
    </div>
  );
}