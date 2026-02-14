'use client';

import { Button, Input, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
   ArrowUp,
   Check,
   ChevronRight,
   File,
   Folder,
   HardDrive,
   Search
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock Data for File System
const mockFileSystem = {
  root: [
    { name: 'C:', type: 'drive', size: '256 GB' },
    { name: 'D:', type: 'drive', size: '512 GB' },
    { name: 'E:', type: 'drive', size: '1 TB' },
  ],
  'C:': [
    { name: 'Program Files', type: 'folder' },
    { name: 'Windows', type: 'folder' },
    { name: 'Users', type: 'folder' },
    { name: 'HyperFamily', type: 'folder' },
  ],
  'C:/HyperFamily': [
    { name: 'Backup', type: 'folder' },
    { name: 'Logs', type: 'folder' },
    { name: 'config.json', type: 'file', size: '2 KB' },
    { name: 'app.exe', type: 'file', size: '15 MB' },
  ],
};

const FileIcon = ({ type, className }) => {
  switch (type) {
    case 'drive': return <HardDrive className={cn("text-text-secondary", className)} />;
    case 'folder': return <Folder className={cn("text-warning", className)} />;
    case 'file': return <File className={cn("text-text-muted", className)} />;
    default: return <File className={cn("text-text-muted", className)} />;
  }
};

const FileBrowserModal = ({ isOpen, onClose, onSelect, mode = 'file' }) => {
  const [currentPath, setCurrentPath] = useState('root');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load items when path changes
  useEffect(() => {
    // In real app, fetch from Electron IPC
    const pathKey = currentPath === 'root' ? 'root' : currentPath;
    setItems(mockFileSystem[pathKey] || []);
  }, [currentPath]);

  const handleNavigate = (item) => {
    if (item.type === 'drive' || item.type === 'folder') {
      const newPath = currentPath === 'root' 
        ? item.name 
        : `${currentPath}/${item.name}`;
      setCurrentPath(newPath);
    }
  };

  const handleGoUp = () => {
    if (currentPath === 'root') return;
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.length === 0 ? 'root' : parts.join('/'));
  };

  const handleSelect = (item) => {
    if (mode === 'folder' && item.type !== 'folder' && item.type !== 'drive') return;
    
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i.name === item.name);
      if (isSelected) return prev.filter(i => i.name !== item.name);
      return [...prev, item];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select ${mode === 'file' ? 'Files' : 'Folders'}`} size="xl">
      <div className="flex flex-col h-[500px]">
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-4 bg-bg-secondary p-2 rounded-lg border border-border">
          <Button variant="ghost" size="icon" onClick={handleGoUp} disabled={currentPath === 'root'}>
            <ArrowUp className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center px-3 py-1.5 bg-bg-primary rounded border border-border text-sm text-text-muted overflow-hidden">
            <span className="truncate">{currentPath === 'root' ? 'My Computer' : currentPath}</span>
          </div>

          <div className="w-64">
            <Input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-9"
            />
          </div>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto bg-bg-primary border border-border rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
            {items.map((item, index) => {
              const isSelected = selectedItems.find(i => i.name === item.name);
              
              return (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  onDoubleClick={() => handleNavigate(item)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative",
                    isSelected 
                      ? "bg-accent/10 border-accent" 
                      : "bg-bg-card border-transparent hover:bg-bg-hover hover:border-border"
                  )}
                >
                  <FileIcon type={item.type} className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-center truncate w-full text-text-primary">
                    {item.name}
                  </span>
                  {item.size && (
                    <span className="text-xs text-text-muted mt-1">{item.size}</span>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="col-span-4 flex flex-col items-center justify-center text-text-muted py-10">
                <Folder className="w-12 h-12 mb-2 opacity-20" />
                <p>This folder is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {selectedItems.length} items selected
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={selectedItems.length === 0}>
              Select
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileBrowserModal;