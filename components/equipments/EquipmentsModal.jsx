'use client';

import { Badge, Button, Card, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
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
  { id: 'accesspoint', name: 'Access Points', icon: Wifi },
  { id: 'pda', name: 'PDAs', icon: Smartphone },
  { id: 'printer', name: 'Printers', icon: Printer },
  { id: 'nvr', name: 'NVRs', icon: Video },
];

const branches = ['Lahijan', 'Ramsar', 'Nowshahr', 'Royan'];

const EquipmentsModal = ({ isOpen, onClose }) => {
  const [selectedBranch, setSelectedBranch] = useState('Lahijan');
  const [selectedType, setSelectedType] = useState(null);

  // Mock data fetching based on branch & type
  const equipments = [
    { id: 1, name: 'Checkout-01', ip: '192.168.1.10', model: 'HP' },
    { id: 2, name: 'Checkout-02', ip: '192.168.1.11', model: 'Dell' },
  ];

  const handleAddEquipment = () => {
    console.log('Open add form for', selectedType);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Branch Equipments Management" size="full">
      <div className="flex h-[70vh] gap-4">
        
        {/* Sidebar: Branches */}
        <div className="w-48 border-r border-border pr-4 space-y-2">
          <h3 className="font-semibold text-text-secondary mb-3 px-2">Branches</h3>
          {branches.map((branch) => (
            <button
              key={branch}
              onClick={() => setSelectedBranch(branch)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                selectedBranch === branch 
                  ? "bg-accent/10 text-accent font-medium" 
                  : "text-text-primary hover:bg-bg-hover"
              )}
            >
              {branch}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              {selectedBranch} Equipment List
            </h2>
            {selectedType && (
              <Button onClick={handleAddEquipment} leftIcon={<Plus className="w-4 h-4" />}>
                Add {selectedType}
              </Button>
            )}
          </div>

          {/* Equipment Types Grid */}
          {!selectedType ? (
            <div className="grid grid-cols-4 gap-4">
              {equipmentTypes.map((type) => (
                <Card 
                  key={type.id} 
                  hover 
                  onClick={() => setSelectedType(type.id)}
                  className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-accent/10 text-accent">
                    <type.icon className="w-8 h-8" />
                  </div>
                  <span className="font-medium text-text-primary">{type.name}</span>
                  <Badge variant="default">0 items</Badge>
                </Card>
              ))}
            </div>
          ) : (
            /* Selected Type List */
            <div className="flex-1 flex flex-col">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedType(null)} 
                className="self-start mb-4"
              >
                ← Back to Categories
              </Button>
              
              <div className="bg-bg-tertiary rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-bg-secondary text-text-secondary">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {equipments.map((item) => (
                      <tr key={item.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-text-muted">{item.ip}</td>
                        <td className="px-4 py-3">{item.model}</td>
                        <td className="px-4 py-3">
                          <Badge variant="success">Active</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost">Edit</Button>
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