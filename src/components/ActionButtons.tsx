import { Upload, Eye, Download, Trash2 } from 'lucide-react';
import { ActionButtonsProps } from '../types';

export const ActionButtons = ({ 
  onPreviewToggle, 
  onClearAll, 
  onDownloadCards,
  showPreview,
  loading 
}: ActionButtonsProps) => (
  <div className="flex items-center gap-4 mb-6">
    <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
      <Upload size={20} />
      Upload Excel
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const event = new CustomEvent('file-selected', { detail: file });
            window.dispatchEvent(event);
          }
        }}
        className="hidden"
      />
    </label>

    <button
      onClick={onPreviewToggle}
      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
    >
      <Eye size={20} />
      {showPreview ? 'Hide Preview' : 'View Cards'}
    </button>

    <button
      onClick={onDownloadCards}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
    >
      <Download size={20} />
      {loading ? 'Processing...' : 'Download Cards'}
    </button>

    <button
      onClick={onClearAll}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      <Trash2 size={20} />
      Clear All
    </button>
  </div>
);