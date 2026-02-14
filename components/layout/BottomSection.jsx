'use client';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ContextMenu from '@/components/ui/ContextMenu';
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
      'inline-block w-2 h-2 rounded-full',
      statusColors[status] || statusColors.unknown
    )} />
  );
};

const DeviceCard = ({ device, status }) => {
  return (
    <ContextMenu items={[]}> {/* Context menu items logic here */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.01, backgroundColor: 'var(--bg-hover)' }}
        className="flex items-center gap-2 p-1.5 rounded bg-bg-tertiary/30 border border-transparent hover:border-border cursor-pointer transition-colors text-xs"
      >
        <StatusIndicator status={status} />
        <DeviceIcon type={device.type} className="w-3.5 h-3.5 text-text-secondary" />
        <span className="truncate flex-1 font-medium text-text-primary" title={device.name}>
          {device.name}
        </span>
        <span className="text-[10px] text-text-muted font-mono">
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
    <Card className="min-w-[240px] w-[240px] flex-shrink-0 flex flex-col h-full border-l-4 border-l-accent p-0 overflow-hidden bg-bg-card/50">
      <div className="bg-bg-secondary px-3 py-2 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            {branch.name}
          </h3>
          <span className="text-xs text-text-muted">{branch.nameFa}</span>
        </div>
        <Badge 
          className="text-[10px] px-1.5 py-0 h-5"
          variant={onlineCount === branchSystems.length && branchSystems.length > 0 ? 'success' : 'warning'}
        >
          {onlineCount}/{branchSystems.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {branchSystems.length > 0 ? (
          branchSystems.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              status={statuses[device.id]?.status || 'unknown'}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
            <Package className="w-8 h-8 mb-1" strokeWidth={1.5} />
            <span className="text-xs">Empty</span>
          </div>
        )}
      </div>
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

  const totalDevices = systems.length;
  const onlineDevices = Object.values(statuses).filter(s => s.status === 'online').length;

  return (
    <div className="flex-1 bg-bg-primary p-2 overflow-hidden flex flex-col border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          System Monitoring
        </h2>
        <div className="flex items-center gap-3 text-xs">
          {isMonitoring && (
            <span className="flex items-center gap-1.5 text-success">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Monitoring
            </span>
          )}
          <Badge variant={isMonitoring ? 'success' : 'default'} className="text-[10px] h-5 px-2">
            {onlineDevices}/{totalDevices} Online
          </Badge>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-1">
        <div className="flex gap-3 h-full px-1">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              systems={systems}
              statuses={statuses}
            />
          ))}
          {branches.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
              No branches found. Add systems to start.
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-1 pt-1 border-t border-border flex justify-between text-[10px] text-text-muted px-1">
        <span>Updated: {new Date().toLocaleTimeString()}</span>
        <span>Hyper Family ICT Manager v1.0.0</span>
      </div>
    </div>
  );
};

export default BottomSection;