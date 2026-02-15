'use client';

import { Button, Checkbox, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useDestinationStore } from '@/store';
import { CheckCircle, Circle, Monitor, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const DestinationBrowserModal = ({ isOpen, onClose, onSelect }) => {
  const { destinations, fetchDestinations } = useDestinationStore();
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) fetchDestinations();
  }, [isOpen]);

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedIds);
    onClose();
  };

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.ip.includes(search)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Destinations" size="lg">
       <div className="flex flex-col h-[450px]">
          {/* Search */}
          <div className="mb-2">
             <input 
               className="w-full bg-bg-secondary border border-border rounded px-3 py-2 text-xs focus:outline-none focus:border-accent"
               placeholder="Search destinations..."
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>

          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-bg-tertiary border-b border-border text-xs font-medium text-text-secondary">
             <div className="col-span-5">Name</div>
             <div className="col-span-4">IP Address</div>
             <div className="col-span-3">Branch</div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto bg-bg-primary border border-border rounded-b">
             {filtered.map(dest => {
               const isSelected = selectedIds.includes(dest.id);
               return (
                 <div 
                   key={dest.id}
                   onClick={() => toggleSelect(dest.id)}
                   className={cn(
                     "grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/50 items-center cursor-pointer text-xs transition-colors",
                     isSelected ? "bg-accent/10" : "hover:bg-bg-hover"
                   )}
                 >
                    <div className="col-span-5 flex items-center gap-2">
                       {isSelected ? <CheckCircle className="w-3.5 h-3.5 text-accent"/> : <Circle className="w-3.5 h-3.5 text-text-muted"/>}
                       <Monitor className="w-3.5 h-3.5 text-text-secondary"/>
                       <span className="truncate font-medium">{dest.name}</span>
                    </div>
                    <div className="col-span-4 font-mono text-text-muted">{dest.ip}</div>
                    <div className="col-span-3 text-text-secondary">{dest.branch}</div>
                 </div>
               );
             })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-xs text-text-muted">{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={onClose} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleConfirm} disabled={selectedIds.length === 0} className="h-8 text-xs">Select</Button>
            </div>
          </div>
       </div>
    </Modal>
  );
};

export default DestinationBrowserModal;