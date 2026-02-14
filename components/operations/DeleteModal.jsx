'use client';

import { Button, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FolderOpen, StopCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleStart = () => {
    startOperation('delete', selectedFiles);
  };

  const handleSelectFiles = () => {
    // Open file browser mock
    console.log('Open file browser');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Files from Destinations" size="xl">
      <div className="space-y-4">
        {/* File Selection Area */}
        <div className="bg-bg-tertiary p-4 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">Files/Folders to Delete:</span>
            <Button size="sm" variant="outline" onClick={handleSelectFiles} leftIcon={<FolderOpen className="w-4 h-4"/>}>
              Select Files
            </Button>
          </div>
          
          <div className="h-20 bg-bg-secondary rounded border border-border flex items-center justify-center text-text-muted text-sm">
            No files selected (Mock)
          </div>
        </div>

        {/* Terminal Log */}
        <Terminal logs={logs} className="h-64" />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} disabled={isRunning}>
            Close
          </Button>
          
          {isRunning ? (
            <Button 
              onClick={stopOperation} 
              variant="secondary"
              leftIcon={<StopCircle className="w-4 h-4" />}
            >
              Stop Operation
            </Button>
          ) : (
            <Button 
              onClick={handleStart} 
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Start Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;