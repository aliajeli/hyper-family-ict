'use client';

import { Button, Input, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowUp,
  CheckCircle,
  Circle,
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
    case 'folder': return <Folder className={cn("text-warning fill-warning/20", className)} />;
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
             // Mock
             setItems([
               { name: 'Local Disk (C:)', type: 'drive', path: 'C:/' },
               { name: 'Windows', type: 'folder', path: 'C:/Windows' },
               { name: 'test.txt', type: 'file', path: 'C:/test.txt' }
             ]);
          }
        } catch (error) {
          console.error(error);
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
          setSearchQuery('');
        }
      };
    
      const handleGoUp = () => {
        if (currentPath === 'root') return;
        if (window.electron && window.electron.platform === 'win32') {
           if (currentPath.endsWith(':\\')) { setCurrentPath('root'); return; }
        }
        const parts = currentPath.split(/[/\\]/);
        parts.pop();
        if (parts.length === 1 && parts[0].includes(':')) { setCurrentPath(parts[0] + '/'); }
        else if (parts.length === 0) { setCurrentPath('root'); }
        else { setCurrentPath(parts.join('/')); }
      };

      const handleSelect = (item) => {
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
      
      const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Select ${mode === 'file' ? 'Files' : 'Folders'}`} size="lg">
      <div className="flex flex-col h-[450px]">
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-2 bg-bg-secondary p-1.5 rounded border border-border">
          <Button variant="ghost" size="icon" onClick={handleGoUp} disabled={currentPath === 'root'} className="h-8 w-8">
            <ArrowUp className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 px-3 py-1.5 bg-bg-primary rounded border border-border text-xs text-text-primary font-mono overflow-hidden whitespace-nowrap">
            {currentPath === 'root' ? 'This PC' : currentPath}
          </div>

          <div className="w-48">
            <Input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-bg-tertiary border-b border-border text-xs font-medium text-text-secondary">
            <div className="col-span-8">Name</div>
            <div className="col-span-4">Type</div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto bg-bg-primary border border-border rounded-b select-none">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredItems.map((item, index) => {
                const isSelected = selectedItems.find(i => i.path === item.path);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    onDoubleClick={() => handleNavigate(item)}
                    className={cn(
                      "grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/50 items-center cursor-pointer text-xs group transition-colors",
                      isSelected 
                        ? "bg-accent/10 hover:bg-accent/20" 
                        : "hover:bg-bg-hover odd:bg-bg-primary even:bg-bg-primary/50"
                    )}
                  >
                    <div className="col-span-8 flex items-center gap-2 overflow-hidden">
                       <button className="text-text-muted hover:text-accent">
                          {isSelected ? <CheckCircle className="w-4 h-4 text-accent" /> : <Circle className="w-4 h-4" />}
                       </button>
                       <FileIcon type={item.type} className="w-4 h-4 shrink-0" />
                       <span className={cn("truncate", isSelected && "font-medium text-accent")}>{item.name}</span>
                    </div>
                    <div className="col-span-4 text-text-muted">
                        {item.type === 'drive' ? 'Drive' : item.type === 'folder' ? 'Folder' : 'File'}
                    </div>
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-text-muted text-xs">Folder is empty</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-text-muted">{selectedItems.length} items selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 text-xs">Cancel</Button>
            <Button size="sm" onClick={handleConfirm} disabled={selectedItems.length === 0} className="h-8 text-xs">
              Select
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileBrowserModal;