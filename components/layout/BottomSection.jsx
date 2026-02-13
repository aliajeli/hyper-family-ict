'use client';

import { cn } from '@/lib/utils';
import { useMonitoringStore, useSystemStore } from '@/store';
import { motion } from 'framer-motion';
import {
   Activity,
   Monitor,
   Network,
   Package,
   RefreshCw,
   Router,
   Server,
   ShoppingCart,
   Video
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Direct imports to avoid issues
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ContextMenu from '@/components/ui/ContextMenu';

const DeviceIcon = ({ type, className }) => {
  const icons = {
    Router: Router,
    Kyan: Server,
    ESXi: Server,
    iLO: Server,
    Switch: Network,
    NVR: Video,
    Client: Monitor,
    Checkout: ShoppingCart,
  };

  const Icon = icons[type] || Monitor;
  return <Icon className={className} />;
};

const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-error',
    checking: 'bg-warning animate-pulse',
    unknown: 'bg-text-muted',
  };

  return (
    <span className={cn(
      'inline-block w-2.5 h-2.5 rounded-full',
      statusColors[status] || statusColors.unknown
    )} />
  );
};

const DeviceCard = ({ device, status }) => {
  const getContextMenuItems = (type) => {
    const baseItems = [
      { label: 'System Info', icon: <Monitor className="w-4 h-4" /> },
    ];

    if (type === 'Client' || type === 'Checkout') {
      return [
        { label: 'RDP', icon: <Monitor className="w-4 h-4" />, onClick: () => console.log('RDP') },
        { label: 'TeamViewer', icon: <Monitor className="w-4 h-4" />, onClick: () => console.log('TeamViewer') },
        ...baseItems,
        { label: 'Printers', icon: <Monitor className="w-4 h-4" /> },
        { label: 'Applications', icon: <Monitor className="w-4 h-4" /> },
        { label: 'Services', icon: <Monitor className="w-4 h-4" /> },
        { label: 'Processes', icon: <Monitor className="w-4 h-4" /> },
        { separator: true },
        { label: 'Power Options', icon: <Monitor className="w-4 h-4" /> },
        { label: 'Send Message', icon: <Monitor className="w-4 h-4" /> },
      ];
    }

    if (type === 'Router') {
      return [
        { label: 'Winbox', icon: <Router className="w-4 h-4" /> },
        ...baseItems,
      ];
    }

    if (type === 'Switch') {
      return [
        { label: 'Termius (SSH)', icon: <Network className="w-4 h-4" /> },
        ...baseItems,
      ];
    }

    if (['Kyan', 'ESXi', 'iLO', 'NVR'].includes(type)) {
      return [
        { label: 'Open in Browser', icon: <Monitor className="w-4 h-4" /> },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  return (
    <ContextMenu items={getContextMenuItems(device.type)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg',
          'bg-bg-tertiary/50 hover:bg-bg-hover',
          'cursor-pointer transition-all duration-200'
        )}
      >
        <StatusIndicator status={status} />
        <DeviceIcon type={device.type} className="w-4 h-4 text-text-secondary" />
        <span className="text-sm text-text-primary truncate flex-1">
          {device.name}
        </span>
        <span className="text-xs text-text-muted">
          {device.ip}
        </span>
      </motion.div>
    </ContextMenu>
  );
};

const BranchCard = ({ branch, systems, statuses }) => {
  const branchSystems = systems.filter(s => s.branch === branch.name || s.branch === branch.nameFa);
  const onlineCount = branchSystems.filter(s => statuses[s.id]?.status === 'online').length;

  return (
    <Card className="min-w-[280px] flex-shrink-0">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            {branch.name}
          </Card.Title>
          <Badge 
            variant={
              onlineCount === branchSystems.length && branchSystems.length > 0 
                ? 'success' 
                : branchSystems.length > 0 
                  ? 'warning' 
                  : 'default'
            }
          >
            {onlineCount}/{branchSystems.length}
          </Badge>
        </div>
        <Card.Description>{branch.nameFa}</Card.Description>
      </Card.Header>

      <Card.Content>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {branchSystems.length > 0 ? (
            branchSystems.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                status={statuses[device.id]?.status || 'unknown'}
              />
            ))
          ) : (
            <p className="text-sm text-text-muted text-center py-4">
              No devices added yet
            </p>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

const BottomSection = () => {
  const { systems, fetchSystems } = useSystemStore();
  const { statuses, isMonitoring } = useMonitoringStore();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    fetchSystems();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
    }
  };

  // Count stats
  const totalDevices = systems.length;
  const onlineDevices = Object.values(statuses).filter(s => s.status === 'online').length;

  return (
    <div className="flex-1 bg-bg-primary p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          System Monitoring
        </h2>
        
        <div className="flex items-center gap-4">
          {isMonitoring && (
            <span className="flex items-center gap-2 text-sm text-success">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Monitoring Active
            </span>
          )}
          <Badge variant={isMonitoring ? 'success' : 'default'}>
            {onlineDevices}/{totalDevices} Online
          </Badge>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 pb-4 h-full">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              systems={systems}
              statuses={statuses}
            />
          ))}

          {branches.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No branches found</p>
                <p className="text-sm text-text-muted">Add branches and systems to see them here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm text-text-muted">
        <span>
          Last Check: {new Date().toLocaleTimeString()}
        </span>
        <span>
          Active Devices: {onlineDevices}/{totalDevices}
        </span>
      </div>
    </div>
  );
};

export default BottomSection;