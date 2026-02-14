'use client';

import FileBrowserModal from '@/components/file-browser/FileBrowserModal';
import { Button, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FolderOpen, Play, Square, X } from 'lucide-react';
import { useState } from 'react';

const CopyModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFileBrowser, setShowFileBrowser] = useState(false);

  const handleStart = () => {
    if (selectedFiles.length === 0) return;
    startOperation('copy', selectedFiles);
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (fileName) => {
    setSelectedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Copy Files" size="lg">
        <div className="space-y-3">
          
          {/* File Selection Area - Compact */}
          <div className="bg-bg-tertiary p-2 rounded border border-border">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-text-secondary">Source Files:</span>
              <Button size="sm" variant="outline" onClick={() => setShowFileBrowser(true)} leftIcon={<FolderOpen className="w-3 h-3"/>} className="h-6 text-xs px-2">
                Add
              </Button>
            </div>
            
            <div className="h-24 overflow-y-auto bg-bg-secondary rounded border border-border p-1 space-y-1 custom-scrollbar">
              {selectedFiles.length > 0 ? (
                selectedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center px-2 py-1 bg-bg-card rounded text-xs group hover:bg-bg-hover">
                    <span className="text-text-primary truncate">{file.name}</span>
                    <button onClick={() => removeFile(file.name)} className="text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted text-xs">
                  No files selected
                </div>
              )}
            </div>
          </div>

          {/* Terminal - Compact Height */}
          <Terminal logs={logs} className="h-48 text-xs" />

          {/* Actions - Compact */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            {isRunning ? (
              <Button 
                onClick={stopOperation} 
                variant="danger"
                size="sm"
                leftIcon={<Square className="w-3 h-3" />}
                className="h-8 text-xs"
              >
                Stop
              </Button>
            ) : (
              <Button 
                onClick={handleStart} 
                variant="success"
                size="sm"
                leftIcon={<Play className="w-3 h-3" />}
                disabled={selectedFiles.length === 0}
                className="h-8 text-xs"
              >
                Start Copy
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isRunning} className="h-8 text-xs">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <FileBrowserModal 
        isOpen={showFileBrowser} 
        onClose={() => setShowFileBrowser(false)} 
        onSelect={handleFilesSelected}
        mode="mixed"
      />
    </>
  );
};

export default CopyModal;