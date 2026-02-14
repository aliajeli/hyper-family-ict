'use client';

import { Button, Checkbox, Input, Modal } from '@/components/ui';
import Terminal from '@/components/ui/Terminal';
import { useFileOperations } from '@/hooks/useFileOperations';
import { FileEdit, StopCircle } from 'lucide-react';
import { useState } from 'react';

const RenameModal = ({ isOpen, onClose }) => {
  const { logs, isRunning, startOperation, stopOperation } = useFileOperations();
  
  const [targetName, setTargetName] = useState('');
  const [newName, setNewName] = useState('');
  const [usePrefix, setUsePrefix] = useState(false);
  const [useSuffix, setUseSuffix] = useState(false);

  const handleStart = () => {
    startOperation('rename', { targetName, newName, usePrefix, useSuffix });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Files/Folders" size="lg">
      <div className="space-y-4">
        
        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Current Name" 
            placeholder="e.g., old-file.txt" 
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
          <Input 
            label="Rename Text" 
            placeholder="e.g., new-name" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="flex gap-6">
          <Checkbox 
            label="Add as Prefix" 
            checked={usePrefix} 
            onChange={(e) => setUsePrefix(e.target.checked)} 
          />
          <Checkbox 
            label="Add as Suffix" 
            checked={useSuffix} 
            onChange={(e) => setUseSuffix(e.target.checked)} 
          />
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
              variant="primary"
              leftIcon={<FileEdit className="w-4 h-4" />}
            >
              Start Rename
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RenameModal;