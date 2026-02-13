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

  const handleStartServices = () => {
    console.log('Starting services:', services);
  };

  const handleStopServices = () => {
    console.log('Stopping services:', services);
  };

  const handleSendMessage = () => {
    console.log('Sending message:', message);
  };

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring([]);
    }
  };

  return (
    <div className="bg-bg-secondary border-b border-border p-4">
      {/* Row 1: Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button
          onClick={onAddSystem}
          leftIcon={<Plus className="w-4 h-4" />}
          variant="primary"
        >
          Add System
        </Button>

        <Button
          onClick={onAddDestination}
          leftIcon={<Target className="w-4 h-4" />}
          variant="secondary"
        >
          Add Destination
        </Button>

        <div className="flex-1 max-w-md">
          <Input
            placeholder="Path (e.g., C:\Program Files\App)"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            icon={<FolderInput className="w-4 h-4" />}
          />
        </div>

        <Button
          onClick={onSettings}
          variant="ghost"
          size="icon"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Row 2: Services */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Services (Service1, Service2, ...)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
          />
        </div>

        <Checkbox
          label="Stop Before"
          checked={stopBefore}
          onChange={(e) => setStopBefore(e.target.checked)}
        />

        <Checkbox
          label="Start After"
          checked={startAfter}
          onChange={(e) => setStartAfter(e.target.checked)}
        />

        <Button
          onClick={handleStartServices}
          leftIcon={<Play className="w-4 h-4" />}
          variant="success"
          size="sm"
        >
          Start Srv
        </Button>

        <Button
          onClick={handleStopServices}
          leftIcon={<Square className="w-4 h-4" />}
          variant="danger"
          size="sm"
        >
          Stop Srv
        </Button>
      </div>

      {/* Row 3: Message */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 max-w-lg">
          <Input
            placeholder="Message to send..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Checkbox
          label="Send After Operation"
          checked={sendAfter}
          onChange={(e) => setSendAfter(e.target.checked)}
        />

        <Button
          onClick={handleSendMessage}
          leftIcon={<Send className="w-4 h-4" />}
          variant="primary"
          size="sm"
        >
          Send Message
        </Button>
      </div>

      {/* Row 4: Operation Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onCopy}
          leftIcon={<Copy className="w-4 h-4" />}
          variant="secondary"
        >
          Copy
        </Button>

        <Button
          onClick={onDelete}
          leftIcon={<Trash2 className="w-4 h-4" />}
          variant="secondary"
        >
          Delete
        </Button>

        <Button
          onClick={onRename}
          leftIcon={<FileEdit className="w-4 h-4" />}
          variant="secondary"
        >
          Rename
        </Button>

        <Button
          onClick={onReplace}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          variant="secondary"
        >
          Replace
        </Button>

        <div className="flex-1" />

        <Button
          onClick={onEquipments}
          leftIcon={<Package className="w-4 h-4" />}
          variant="secondary"
        >
          Equipments
        </Button>

        <Button
          onClick={handleToggleMonitoring}
          leftIcon={<Activity className="w-4 h-4" />}
          variant={isMonitoring ? 'danger' : 'success'}
        >
          {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
        </Button>

        <Button
          onClick={onAbout}
          leftIcon={<Info className="w-4 h-4" />}
          variant="ghost"
        >
          About
        </Button>
      </div>
    </div>
  );
};

export default TopSection;