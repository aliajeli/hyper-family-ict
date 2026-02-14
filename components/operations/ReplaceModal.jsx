'use client';

import { Button, Input, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FolderOpen, RefreshCw, StopCircle } from 'lucide-react';
import { useState } from 'react';

const ReplaceModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  const [prefix, setPrefix] = useState('');

  const handleStart = () => {
    startOperation('replace', { prefix });
  };

  const handleSelectFiles = () => {
    console.log('Open file browser');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Replace Files in Destinations" size="xl">
      <div className="space-y-4">
        
        {/* Prefix Input */}
        <Input 
          label="Prefix for Old Files (Backup)" 
          placeholder="e.g., BACKUP_" 
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />

        {/* File Selection */}
        <div className="bg-bg-tertiary p-4 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">New Files to Upload:</span>
            <Button size="sm" variant="outline" onClick={handleSelectFiles} leftIcon={<FolderOpen className="w-4 h-4"/>}>
              Select Files
            </Button>
          </div>
          <div className="h-16 bg-bg-secondary rounded border border-border flex items-center justify-center text-text-muted text-sm">
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
              variant="warning"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Start Replace
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReplaceModal;