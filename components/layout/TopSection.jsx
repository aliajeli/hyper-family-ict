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
import toast from 'react-hot-toast';

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
  const [isServiceRunning, setIsServiceRunning] = useState(false);

  const { isMonitoring, startMonitoring, stopMonitoring } = useMonitoringStore();

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      // Pass empty array for now, store handles fetching
      startMonitoring([]);
      toast.success('Monitoring started');
    }
  };

  const handleStartServices = async () => {
    if (!services) return toast.error('Please enter service name');
    
    setIsServiceRunning(true);
    toast.loading(`Starting ${services}...`);

    // Mock targets - In real app, get from selected destinations
    const targets = [{ ip: '127.0.0.1' }]; 

    for (const target of targets) {
      try {
        if (window.electron) {
          const result = await window.electron.manageService(target.ip, services, 'start');
          if (result.success) {
            toast.success(`Started ${services} on ${target.ip}`);
          } else {
            toast.error(`Failed on ${target.ip}: ${result.error}`);
          }
        } else {
          await new Promise(r => setTimeout(r, 500));
          toast.success(`[Mock] Started ${services} on ${target.ip}`);
        }
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    }
    
    toast.dismiss();
    setIsServiceRunning(false);
  };

  const handleStopServices = async () => {
    if (!services) return toast.error('Please enter service name');
    
    setIsServiceRunning(true);
    toast.loading(`Stopping ${services}...`);

    const targets = [{ ip: '127.0.0.1' }];

    for (const target of targets) {
      try {
        if (window.electron) {
          const result = await window.electron.manageService(target.ip, services, 'stop');
          if (result.success) {
            toast.success(`Stopped ${services} on ${target.ip}`);
          } else {
            toast.error(`Failed on ${target.ip}: ${result.error}`);
          }
        } else {
          await new Promise(r => setTimeout(r, 500));
          toast.success(`[Mock] Stopped ${services} on ${target.ip}`);
        }
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    }
    
    toast.dismiss();
    setIsServiceRunning(false);
  };

  const handleSendMessage = async () => {
    if (!message) return toast.error('Please enter a message');
    
    // Logic for sending message (msg command)
    // msg * /server:IP "Message"
    toast.success(`Message sent: "${message}"`);
  };

  return (
    <div className="bg-bg-secondary border-b border-border p-2 space-y-2 text-sm select-none">
      {/* Row 1: System & Path */}
      <div className="flex items-center gap-2">
        <Button onClick={onAddSystem} leftIcon={<Plus className="w-3.5 h-3.5" />} size="sm" variant="primary" className="h-8 text-xs">
          Add System
        </Button>
        <Button onClick={onAddDestination} leftIcon={<Target className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs">
          Add Dest
        </Button>
        <div className="flex-1">
          <Input 
            placeholder="Remote Path (e.g., C:\HyperFamily\App)" 
            value={path} 
            onChange={(e) => setPath(e.target.value)} 
            icon={<FolderInput className="w-3.5 h-3.5" />}
            className="h-8 text-xs"
          />
        </div>
        <Button onClick={onSettings} variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-text-primary">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Row 2: Services */}
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Input 
            placeholder="Services (Spooler, W3SVC...)" 
            value={services} 
            onChange={(e) => setServices(e.target.value)}
            className="h-8 text-xs font-mono"
          />
        </div>
        <div className="flex items-center gap-3 px-3 border-l border-r border-border h-8 bg-bg-primary/30 rounded">
          <Checkbox 
            label="Stop Before" 
            checked={stopBefore} 
            onChange={(e) => setStopBefore(e.target.checked)} 
            className="text-[10px]" 
          />
          <Checkbox 
            label="Start After" 
            checked={startAfter} 
            onChange={(e) => setStartAfter(e.target.checked)} 
            className="text-[10px]" 
          />
        </div>
        <Button 
          onClick={handleStartServices}
          disabled={isServiceRunning}
          size="sm" 
          variant="success" 
          leftIcon={<Play className="w-3.5 h-3.5" />} 
          className="h-8 text-xs min-w-[90px]"
        >
          Start Srv
        </Button>
        <Button 
          onClick={handleStopServices}
          disabled={isServiceRunning}
          size="sm" 
          variant="danger" 
          leftIcon={<Square className="w-3.5 h-3.5" />} 
          className="h-8 text-xs min-w-[90px]"
        >
          Stop Srv
        </Button>
      </div>

      {/* Row 3: Message */}
      <div className="flex items-center gap-2">
        <div className="flex-[2]">
          <Input 
            placeholder="Message to send..." 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center px-3 border-l border-r border-border h-8 bg-bg-primary/30 rounded">
          <Checkbox 
            label="Send After Op" 
            checked={sendAfter} 
            onChange={(e) => setSendAfter(e.target.checked)} 
            className="text-[10px] whitespace-nowrap" 
          />
        </div>
        <Button 
          onClick={handleSendMessage}
          size="sm" 
          variant="primary" 
          leftIcon={<Send className="w-3.5 h-3.5" />} 
          className="h-8 text-xs whitespace-nowrap min-w-[100px]"
        >
          Send Msg
        </Button>
      </div>

      {/* Row 4: Operations */}
      <div className="flex items-center gap-2 pt-2 border-t border-border mt-1">
        <Button onClick={onCopy} leftIcon={<Copy className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs min-w-[80px]">Copy</Button>
        <Button onClick={onDelete} leftIcon={<Trash2 className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs min-w-[80px]">Delete</Button>
        <Button onClick={onRename} leftIcon={<FileEdit className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs min-w-[80px]">Rename</Button>
        <Button onClick={onReplace} leftIcon={<RefreshCw className="w-3.5 h-3.5" />} size="sm" variant="secondary" className="h-8 text-xs min-w-[80px]">Replace</Button>
        
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