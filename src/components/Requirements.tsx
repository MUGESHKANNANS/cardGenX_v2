import { AlertCircle } from 'lucide-react';
import { RequirementsProps } from '../types';

export const Requirements = ({ requirements }: RequirementsProps) => (
  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
    <div className="flex items-center gap-2 mb-2 text-blue-700">
      <AlertCircle size={20} />
      <h2 className="font-semibold">Requirements</h2>
    </div>
    <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
      {requirements.map((req, index) => (
        <li key={index}>{req}</li>
      ))}
    </ul>
  </div>
);