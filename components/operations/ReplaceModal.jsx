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
    <Modal isOpen={isOpen} onClose={onClose} title="Replace Files" size="lg">
      <div className="space-y-3">
        
        {/* Top Row: Prefix & Button */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
             <Input 
              label="Backup Prefix" 
              placeholder="e.g., BK_" 
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Button size="sm" variant="outline" onClick={handleSelectFiles} leftIcon={<FolderOpen className="w-3 h-3"/>} className="h-8 text-xs mb-[2px]">
            Select Source Files
          </Button>
        </div>

        {/* File Preview */}
        <div className="h-16 bg-bg-tertiary rounded border border-border flex items-center justify-center text-text-muted text-xs">
          No files selected (Mock)
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
              variant="warning"
              size="sm"
              leftIcon={<RefreshCw className="w-3 h-3" />}
              className="h-8 text-xs"
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