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
    <Modal isOpen={isOpen} onClose={onClose} title="Rename" size="md">
      <div className="space-y-3">
        
        {/* Input Fields - Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Input 
            label="Current Name" 
            placeholder="e.g., old.txt" 
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            className="h-8 text-xs"
          />
          <Input 
            label="Rename Text" 
            placeholder="e.g., new" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {/* Options - Compact Row */}
        <div className="flex gap-4 px-1">
          <Checkbox 
            label="Add Prefix" 
            checked={usePrefix} 
            onChange={(e) => setUsePrefix(e.target.checked)} 
            className="text-xs"
          />
          <Checkbox 
            label="Add Suffix" 
            checked={useSuffix} 
            onChange={(e) => setUseSuffix(e.target.checked)} 
            className="text-xs"
          />
        </div>

        {/* Terminal Log */}
        <Terminal logs={logs} className="h-40 text-xs" />

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
              variant="primary"
              size="sm"
              leftIcon={<FileEdit className="w-3 h-3" />}
              className="h-8 text-xs"
            >
              Rename
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RenameModal;