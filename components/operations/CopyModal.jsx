'use client';

import { Button, Checkbox, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FolderOpen, Play, Square } from 'lucide-react';
import { useState } from 'react';

const CopyModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  const [selectedFiles, setSelectedFiles] = useState([]); // Mock files

  const handleStart = () => {
    startOperation('copy');
  };

  const handleSelectFiles = () => {
    // Open custom file browser (Next step)
    console.log('Open file browser');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Copy Files to Destinations" size="xl">
      <div className="space-y-4">
        {/* File Selection Area */}
        <div className="bg-bg-tertiary p-4 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">Selected Files/Folders:</span>
            <Button size="sm" variant="outline" onClick={handleSelectFiles} leftIcon={<FolderOpen className="w-4 h-4"/>}>
              Add File/Folder
            </Button>
          </div>
          
          <div className="h-20 bg-bg-secondary rounded border border-border flex items-center justify-center text-text-muted text-sm">
            No files selected (Mock)
          </div>
        </div>

        {/* Terminal */}
        <Terminal logs={logs} />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          {isRunning ? (
            <Button 
              onClick={stopOperation} 
              variant="danger"
              leftIcon={<Square className="w-4 h-4" />}
            >
              Stop Operation
            </Button>
          ) : (
            <Button 
              onClick={handleStart} 
              variant="success"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Start Copy
            </Button>
          )}
          
          <Button variant="ghost" onClick={onClose} disabled={isRunning}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CopyModal;