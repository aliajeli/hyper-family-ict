'use client';

import { Button, Input, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
   ArrowUp,
   Check,
   File,
   Folder,
   HardDrive,
   Loader2,
   Search
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load items when path changes
  useEffect(() => {
    if (!isOpen) return;

    const loadFiles = async () => {
      setLoading(true);
      try {
        if (window.electron) {
          const files = await window.electron.readDir(currentPath);
          setItems(files);
        } else {
          // Fallback to mock data for browser dev
          console.warn('Electron not detected, using mock data');
          setItems([
            { name: 'Mock Drive C:', type: 'drive', path: 'C:/' },
            { name: 'Mock Folder', type: 'folder', path: 'C:/Mock' },
            { name: 'mock-file.txt', type: 'file', path: 'C:/mock-file.txt' },
          ]);
        }
      } catch (error) {
        console.error('Failed to load files:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentPath, isOpen]);

  const handleNavigate = (item) => {
    if (item.type === 'drive' || item.type === 'folder') {
      setCurrentPath(item.path);
      setSearchQuery(''); // Clear search on navigation
    }
  };

  const handleGoUp = () => {
    if (currentPath === 'root') return;
    
    // Logic to go up one level
    if (window.electron && window.electron.platform === 'win32') {
       if (currentPath.endsWith(':\\')) {
         setCurrentPath('root');
         return;
       }
    }
    
    const parts = currentPath.split(/[/\\]/);
    parts.pop();
    // Handle root drive case (e.g., C:/ -> root)
    if (parts.length === 1 && parts[0].includes(':')) {
       setCurrentPath(parts[0] + '/');
    } else if (parts.length === 0) {
       setCurrentPath('root');
    } else {
       setCurrentPath(parts.join('/'));
    }
  };

  const handleSelect = (item) => {
    // Selection logic based on mode
    if (mode === 'folder' && item.type === 'file') return;
    
    setSelectedItems(prev => {
      const isSelected = prev.find(i => i.path === item.path);
      if (isSelected) return prev.filter(i => i.path !== item.path);
      return [...prev, item];
    });
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };
  
  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex-1 overflow-y-auto bg-bg-primary border border-border rounded-lg p-4 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredItems.map((item, index) => {
                const isSelected = selectedItems.find(i => i.path === item.path);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    onDoubleClick={() => handleNavigate(item)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group relative select-none",
                      isSelected 
                        ? "bg-accent/10 border-accent" 
                        : "bg-bg-card border-transparent hover:bg-bg-hover hover:border-border"
                    )}
                  >
                    <FileIcon type={item.type} className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-center truncate w-full text-text-primary" title={item.name}>
                      {item.name}
                    </span>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-0.5 shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredItems.length === 0 && !loading && (
                <div className="col-span-4 flex flex-col items-center justify-center text-text-muted py-10">
                  <Folder className="w-12 h-12 mb-2 opacity-20" />
                  <p>This folder is empty</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {selectedItems.length} items selected
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleConfirm} 
              disabled={selectedItems.length === 0}
              variant="primary"
            >
              Select ({selectedItems.length})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileBrowserModal;