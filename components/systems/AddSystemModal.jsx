'use client';

import {
   Button,
   Input,
   Modal,
   Select
} from '@/components/ui';
import { useSystemStore } from '@/store';
import {
   Monitor,
   Network,
   Router,
   Save,
   Server,
   ShoppingCart,
   Video
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const deviceTypes = [
  { value: 'Router', label: 'Router', icon: <Router className="w-4 h-4" /> },
  { value: 'Kyan', label: 'Kyan Server', icon: <Server className="w-4 h-4" /> },
  { value: 'ESXi', label: 'ESXi Server', icon: <Server className="w-4 h-4" /> },
  { value: 'iLO', label: 'iLO', icon: <Server className="w-4 h-4" /> },
  { value: 'Switch', label: 'Switch', icon: <Network className="w-4 h-4" /> },
  { value: 'NVR', label: 'NVR', icon: <Video className="w-4 h-4" /> },
  { value: 'Client', label: 'Client PC', icon: <Monitor className="w-4 h-4" /> },
  { value: 'Checkout', label: 'Checkout', icon: <ShoppingCart className="w-4 h-4" /> },
];

const branches = [
  { value: 'Lahijan', label: 'Lahijan (لاهیجان)' },
  { value: 'Ramsar', label: 'Ramsar (رامسر)' },
  { value: 'Nowshahr', label: 'Nowshahr (نوشهر)' },
  { value: 'Royan', label: 'Royan (رویان)' },
];

const AddSystemModal = ({ isOpen, onClose }) => {
  const { addSystem } = useSystemStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    branch: 'Lahijan',
    type: 'Client',
    name: '',
    ip: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip) {
      toast.error('Name and IP are required');
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await addSystem({
      ...formData,
      status: 'unknown' // Initial status
    });

    setIsLoading(false);

    if (result.success) {
      toast.success('System added successfully');
      setFormData({ ...formData, name: '', ip: '' }); // Reset partial form
      onClose();
    } else {
      toast.error('Failed to add system');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New System" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Branch"
            options={branches}
            value={formData.branch}
            onChange={(val) => setFormData({ ...formData, branch: val })}
          />
          <Select
            label="Device Type"
            options={deviceTypes}
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val })}
          />
        </div>

        <Input
          label="System Name"
          placeholder="e.g., Client-01"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="IP Address"
          placeholder="e.g., 192.168.1.100"
          value={formData.ip}
          onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save System
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSystemModal;