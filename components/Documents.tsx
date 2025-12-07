import React from 'react';
import { useStore } from '../context/StoreContext';
import { FileText, FileSpreadsheet, FileImage, Download, MoreVertical } from 'lucide-react';

export const Documents: React.FC = () => {
  const { documents } = useStore();

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'PDF': return <FileText className="w-8 h-8 text-rose-500" />;
      case 'XLSX': return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
      case 'IMG': return <FileImage className="w-8 h-8 text-blue-500" />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Documents</h2>
          <p className="text-slate-500 text-sm">Manage company files and assets</p>
        </div>
        <div className="flex gap-2">
            <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium">New Folder</button>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">Upload File</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {documents.map(doc => (
          <div key={doc.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-105 transition-transform">
                {getFileIcon(doc.type)}
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-semibold text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h4>
            <div className="flex justify-between items-end mt-4">
               <div>
                  <p className="text-xs text-slate-400">{doc.size} • {doc.date}</p>
                  <p className="text-xs text-slate-500 mt-1">By {doc.uploadedBy}</p>
               </div>
               <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                 <Download className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
        
        {/* Dropzone Placeholder */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/10 transition-colors cursor-pointer min-h-[180px]">
          <span className="text-4xl font-light mb-2">+</span>
          <span className="text-sm font-medium">Drag & Drop files</span>
        </div>
      </div>
    </div>
  );
};
