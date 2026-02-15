'use client';

import { Button, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FolderOpen, StopCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
// اضافه کردن این خط:
import { useDestinationStore } from '@/store';
// و در صورت نیاز DestinationSelector:
import DestinationSelector from '@/components/destinations/DestinationSelector';

const DeleteModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  const { destinations, selectedDestinations } = useDestinationStore();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleStart = () => {
    const targets = destinations.filter(d => selectedDestinations.includes(d.id));
    if (selectedFiles.length > 0 && targets.length > 0) {
      startOperation('delete', { files: selectedFiles, targets });
    }
  };

  const handleSelectFiles = () => {
    console.log('Open file browser');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Files" size="lg">
      <div className="space-y-3">
        {/* File Selection Area */}
        <div className="bg-bg-tertiary p-2 rounded border border-border">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-text-secondary">Items to Delete:</span>
            <Button size="sm" variant="outline" onClick={handleSelectFiles} leftIcon={<FolderOpen className="w-3 h-3"/>} className="h-6 text-xs px-2">
              Select
            </Button>
          </div>
          
          <div className="h-20 bg-bg-secondary rounded border border-border flex items-center justify-center text-text-muted text-xs">
            No items selected (Mock)
          </div>
        </div>

        {/* Terminal Log */}
        <Terminal logs={logs} className="h-48 text-xs" />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
           <Button variant="ghost" size="sm" onClick={onClose} disabled={isRunning} className="h-8 text-xs">
            Close
          </Button>

          {isRunning ? (
            <Button 
              onClick={stopOperation} 
              variant="secondary"
              size="sm"
              leftIcon={<StopCircle className="w-3 h-3" />}
              className="h-8 text-xs"
            >
              Stop
            </Button>
          ) : (
            <Button 
              onClick={handleStart} 
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3 h-3" />}
              className="h-8 text-xs"
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