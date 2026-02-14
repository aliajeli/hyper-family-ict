'use client';

import { Badge, Button, Card, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Monitor,
  Network,
  Plus,
  Printer,
  Scale,
  ShoppingCart,
  Smartphone,
  Video,
  Wifi
} from 'lucide-react';
import { useState } from 'react';

const equipmentTypes = [
  { id: 'checkout', name: 'Checkouts', icon: ShoppingCart },
  { id: 'client', name: 'Clients', icon: Monitor },
  { id: 'scale', name: 'Scales', icon: Scale },
  { id: 'switch', name: 'Switches', icon: Network },
  { id: 'accesspoint', name: 'APs', icon: Wifi }, // Shortened name
  { id: 'pda', name: 'PDAs', icon: Smartphone },
  { id: 'printer', name: 'Printers', icon: Printer },
  { id: 'nvr', name: 'NVRs', icon: Video },
];

const branches = ['Lahijan', 'Ramsar', 'Nowshahr', 'Royan'];

const EquipmentsModal = ({ isOpen, onClose }) => {
  const [selectedBranch, setSelectedBranch] = useState('Lahijan');
  const [selectedType, setSelectedType] = useState(null);

  const equipments = [
    { id: 1, name: 'Checkout-01', ip: '192.168.1.10', model: 'HP' },
    { id: 2, name: 'Checkout-02', ip: '192.168.1.11', model: 'Dell' },
  ];

  const handleAddEquipment = () => {
    console.log('Open add form for', selectedType);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Equipments" size="full" className="max-w-5xl h-[600px]">
      <div className="flex h-[500px] gap-3">
        
        {/* Sidebar: Branches - Compact */}
        <div className="w-36 border-r border-border pr-3 space-y-1">
          <h3 className="text-xs font-semibold text-text-secondary mb-2 px-2 uppercase tracking-wider">Branches</h3>
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded text-sm transition-colors",
                selectedBranch === branch 
                  ? "bg-accent/10 text-accent font-medium border-l-2 border-accent" 
                  : "text-text-primary hover:bg-bg-hover border-l-2 border-transparent"
              )}
            >
              {branch}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="text-text-muted font-normal">Branch:</span> {selectedBranch}
            </h2>
            {selectedType && (
              <Button onClick={handleAddEquipment} size="sm" leftIcon={<Plus className="w-3 h-3" />} className="h-7 text-xs">
                Add New
              </Button>
            )}
          </div>

          {/* Equipment Types Grid */}
          {!selectedType ? (
            <div className="grid grid-cols-4 gap-3">
              {equipmentTypes.map((type) => (
                <Card 
                  key={type.id} 
                  hover 
                  onClick={() => setSelectedType(type.id)}
                  className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer bg-bg-secondary border-bg-tertiary"
                >
                  <div className="p-2 rounded-full bg-accent/5 text-accent">
                    <type.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-sm text-text-primary">{type.name}</span>
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">0</Badge>
                </Card>
              ))}
            </div>
          ) : (
            /* Selected Type List */
            <div className="flex-1 flex flex-col">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedType(null)} 
                leftIcon={<ArrowLeft className="w-3 h-3" />}
                className="self-start mb-2 h-7 text-xs"
              >
                Back
              </Button>
              
              <div className="bg-bg-tertiary rounded border border-border overflow-hidden flex-1">
                <table className="w-full text-xs text-left">
                  <thead className="bg-bg-secondary text-text-secondary">
                    <tr>
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">IP Address</th>
                      <th className="px-3 py-2 font-medium">Model</th>
                      <th className="px-3 py-2 font-medium">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {equipments.map((item) => (
                      <tr key={item.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-3 py-1.5 font-medium">{item.name}</td>
                        <td className="px-3 py-1.5 text-text-muted font-mono">{item.ip}</td>
                        <td className="px-3 py-1.5">{item.model}</td>
                        <td className="px-3 py-1.5">
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">Active</Badge>
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Button size="sm" variant="ghost" className="h-6 text-xs px-2">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EquipmentsModal;