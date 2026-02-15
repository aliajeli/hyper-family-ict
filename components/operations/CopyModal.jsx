'use client';

import DestinationBrowserModal from '@/components/destinations/DestinationBrowserModal';
import FileBrowserModal from '@/components/file-browser/FileBrowserModal';
import { Button, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { useDestinationStore } from '@/store';
import { FolderOpen, Monitor, Play, Square, X } from 'lucide-react';
import { useState } from 'react';

const CopyModal = ({ isOpen, onClose }) => {
  // هوک عملیات فایل
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  
  // استور مقصدها
  const { destinations } = useDestinationStore();
  
  // استیت‌های داخلی
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetIds, setTargetIds] = useState([]);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  const [showDestBrowser, setShowDestBrowser] = useState(false);

  // پیدا کردن آبجکت‌های کامل مقصد بر اساس ID
  const selectedTargets = destinations.filter(d => targetIds.includes(d.id));

  // --- هندلر شروع کپی ---
  const handleStart = () => {
    console.log('🔵 Button Clicked: Start Copy');
    console.log('📂 Selected Files:', selectedFiles);
    console.log('🎯 Selected Targets:', selectedTargets);

    if (selectedFiles.length === 0) {
      console.error('❌ No files selected!');
      return;
    }
    if (selectedTargets.length === 0) {
      console.error('❌ No targets selected!');
      return;
    }

    console.log('✅ Conditions met. Calling startOperation...');
    
    // فراخوانی هوک
    startOperation('copy', { 
      files: selectedFiles, 
      targets: selectedTargets 
    });
  };
  // -----------------------

  const handleFilesSelected = (files) => {
    console.log('Files Selected:', files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleDestSelected = (ids) => {
    console.log('Dest IDs Selected:', ids);
    setTargetIds(prev => [...new Set([...prev, ...ids])]);
  };

  const removeFile = (path) => setSelectedFiles(prev => prev.filter(f => f.path !== path));
  const removeDest = (id) => setTargetIds(prev => prev.filter(i => i !== id));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Copy Files" size="full" className="max-w-6xl h-[700px]">
        <div className="grid grid-cols-12 gap-4 h-[600px]">
          
          {/* LEFT COLUMN */}
          <div className="col-span-4 flex flex-col gap-4 h-full">
            
            {/* 1. Files List */}
            <div className="flex-1 flex flex-col bg-bg-tertiary rounded border border-border overflow-hidden">
               <div className="p-2 border-b border-border bg-bg-secondary flex justify-between items-center">
                  <span className="text-xs font-bold text-text-primary">1. Source Files</span>
                  <Button size="sm" onClick={() => setShowFileBrowser(true)} leftIcon={<FolderOpen className="w-3 h-3"/>} className="h-6 text-[10px] px-2">Add Files</Button>
               </div>
               <div className="flex-1 overflow-y-auto p-1 space-y-1 custom-scrollbar">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="flex justify-between items-center px-2 py-1.5 bg-bg-card rounded border border-border/50 text-xs group">
                       <div className="truncate flex-1" title={file.path}>
                          <div className="font-medium text-text-primary">{file.name}</div>
                          <div className="text-[10px] text-text-muted truncate">{file.path}</div>
                       </div>
                       <button onClick={() => removeFile(file.path)} className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100"><X className="w-3.5 h-3.5"/></button>
                    </div>
                  ))}
                  {selectedFiles.length === 0 && <div className="text-center text-xs text-text-muted mt-10">No files selected</div>}
               </div>
            </div>

            {/* 2. Destinations List */}
            <div className="flex-1 flex flex-col bg-bg-tertiary rounded border border-border overflow-hidden">
               <div className="p-2 border-b border-border bg-bg-secondary flex justify-between items-center">
                  <span className="text-xs font-bold text-text-primary">2. Destinations</span>
                  <Button size="sm" onClick={() => setShowDestBrowser(true)} leftIcon={<Monitor className="w-3 h-3"/>} className="h-6 text-[10px] px-2">Add Targets</Button>
               </div>
               <div className="flex-1 overflow-y-auto p-1 space-y-1 custom-scrollbar">
                  {selectedTargets.map((dest, i) => (
                    <div key={i} className="flex justify-between items-center px-2 py-1.5 bg-bg-card rounded border border-border/50 text-xs group">
                       <div className="truncate flex-1">
                          <div className="font-medium text-text-primary">{dest.name}</div>
                          <div className="text-[10px] text-text-muted font-mono">{dest.ip}</div>
                       </div>
                       <button onClick={() => removeDest(dest.id)} className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5"/></button>
                    </div>
                  ))}
                  {selectedTargets.length === 0 && <div className="text-center text-xs text-text-muted mt-10">No destinations</div>}
               </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-8 flex flex-col h-full gap-2 relative">
             <Terminal logs={logs} className="flex-1 h-full text-xs" />
             
             {/* Action Bar */}
             <div className="flex justify-between items-center bg-bg-tertiary p-2 rounded border border-border shrink-0">
                <div className="text-xs text-text-secondary pl-2">
                   Ready to copy {selectedFiles.length} files to {selectedTargets.length} systems.
                </div>
                
                <div className="flex gap-2">
                   {isRunning ? (
                     <Button 
                       onClick={() => {
                         console.log('🔴 Stop Clicked');
                         stopOperation();
                       }} 
                       variant="danger" 
                       size="sm" 
                       leftIcon={<Square className="w-3 h-3"/>} 
                       className="h-8 text-xs px-4"
                     >
                       Stop Operation
                     </Button>
                   ) : (
                     <Button 
                       onClick={handleStart} 
                       variant="success" 
                       size="sm" 
                       leftIcon={<Play className="w-3 h-3"/>} 
                       className="h-8 text-xs px-4"
                       // 👇 دکمه رو موقتاً غیرفعال نکنیم تا ببینیم لاگ میده یا نه
                       // disabled={selectedFiles.length === 0 || selectedTargets.length === 0}
                     >
                       Start Copy
                     </Button>
                   )}
                   
                   <Button variant="ghost" size="sm" onClick={onClose} disabled={isRunning} className="h-8 text-xs px-4">
                     Close
                   </Button>
                </div>
             </div>
          </div>

        </div>
      </Modal>

      <FileBrowserModal isOpen={showFileBrowser} onClose={() => setShowFileBrowser(false)} onSelect={handleFilesSelected} mode="mixed" />
      <DestinationBrowserModal isOpen={showDestBrowser} onClose={() => setShowDestBrowser(false)} onSelect={handleDestSelected} />
    </>
  );
};

export default CopyModal;