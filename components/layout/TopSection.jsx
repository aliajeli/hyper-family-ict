'use client';

import { Button, Checkbox, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useMonitoringStore } from '@/store';
import {
  Activity,
  Copy,
  FileEdit,
  FolderInput,
  Info,
  Package,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Square,
  Target,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

const TopSection = ({
  onAddSystem,
  onAddDestination,
  onCopy,
  onDelete,
  onRename,
  onReplace,
  onEquipments,
  onAbout,
  onSettings,
}) => {
  const [path, setPath] = useState('');
  const [services, setServices] = useState('');
  const [message, setMessage] = useState('');
  const [stopBefore, setStopBefore] = useState(false);
  const [startAfter, setStartAfter] = useState(false);
  const [sendAfter, setSendAfter] = useState(false);

  const { isMonitoring, startMonitoring, stopMonitoring } = useMonitoringStore();

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring([]);
    }
  };

  return (
    <div className="bg-bg-secondary border-b border-border p-2 space-y-2 text-sm">
      {/* Row 1: System & Path */}
      <div className="flex items-center gap-2">
        <Button onClick={onAddSystem} leftIcon={<Plus className="w-3.5 h-3.5" />} size="sm" variant="primary">
          Add System
        </Button>
        <Button onClick={onAddDestination} leftIcon={<Target className="w-3.5 h-3.5" />} size="sm" variant="secondary">
          Add Dest
        </Button>
        <div className="flex-1">
          <Input 
            placeholder="Path (e.g., C:\App)" 
            value={path} 
            onChange={(e) => setPath(e.target.value)} 
            icon={<FolderInput className="w-3.5 h-3.5" />}
            className="h-8 text-sm"
          />
        </div>
        <Button onClick={onSettings} variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Row 2: Services */}
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Input 
            placeholder="Services (Srv1, Srv2...)" 
            value={services} 
            onChange={(e) => setServices(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-3 px-2 border-l border-r border-border h-8">
          <Checkbox label="Stop Before" checked={stopBefore} onChange={(e) => setStopBefore(e.target.checked)} className="text-xs" />
          <Checkbox label="Start After" checked={startAfter} onChange={(e) => setStartAfter(e.target.checked)} className="text-xs" />
        </div>
        <Button size="sm" variant="success" leftIcon={<Play className="w-3.5 h-3.5" />} className="h-8 text-xs">Start Srv</Button>
        <Button size="sm" variant="danger" leftIcon={<Square className="w-3.5 h-3.5" />} className="h-8 text-xs">Stop Srv</Button>
      </div>

      {/* Row 3: Message */}
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Input 
            placeholder="Message to send..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <Checkbox label="Send After Op" checked={sendAfter} onChange={(e) => setSendAfter(e.target.checked)} className="text-xs whitespace-nowrap" />
        <Button size="sm" variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />} className="h-8 text-xs whitespace-nowrap">Send Msg</Button>
      </div>

      {/* Row 4: Operations */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button onClick={onCopy} leftIcon={<Copy className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">Copy</Button>
        <Button onClick={onDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">Delete</Button>
        <Button onClick={onRename} leftIcon={<FileEdit className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">Rename</Button>
        <Button onClick={onReplace} leftIcon={<RefreshCw className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">Replace</Button>
        
        <div className="flex-1" />
        
        <Button onClick={onEquipments} leftIcon={<Package className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">Equipments</Button>
        <Button 
          onClick={handleToggleMonitoring} 
          leftIcon={<Activity className="w-3.5 h-3.5" />} 
          size="sm"
          variant={isMonitoring ? 'danger' : 'success'}
          className="h-8 text-xs whitespace-nowrap"
        >
          {isMonitoring ? 'Stop Monitor' : 'Start Monitor'}
        </Button>
        <Button onClick={onAbout} leftIcon={<Info className="w-3.5 h-3.5" />} size="sm" variant="ghost" className="h-8 text-xs">About</Button>
      </div>
    </div>
  );
};

export default TopSection;