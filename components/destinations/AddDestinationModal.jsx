'use client';

import { Button, Input, Modal, Select } from '@/components/ui';
import { useDestinationStore } from '@/store';
import { Save, Target } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const branches = [
  { value: 'Lahijan', label: 'Lahijan' },
  { value: 'Ramsar', label: 'Ramsar' },
  { value: 'Nowshahr', label: 'Nowshahr' },
  { value: 'Royan', label: 'Royan' },
];

const districts = [
  { value: '14', label: 'District 14' },
];

const AddDestinationModal = ({ isOpen, onClose }) => {
  const { addDestination } = useDestinationStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    district: '14',
    branch: 'Lahijan',
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
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await addDestination(formData);
    setIsLoading(false);

    if (result.success) {
      toast.success('Destination added successfully');
      setFormData({ ...formData, name: '', ip: '' });
      onClose();
    } else {
      toast.error('Failed to add destination');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Destination System" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="District"
            options={districts}
            value={formData.district}
            onChange={(val) => setFormData({ ...formData, district: val })}
          />
          <Select
            label="Branch"
            options={branches}
            value={formData.branch}
            onChange={(val) => setFormData({ ...formData, branch: val })}
          />
        </div>

        <Input
          label="System Name"
          placeholder="e.g., BackOffice-PC"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<Target className="w-4 h-4" />}
        />

        <Input
          label="IP Address"
          placeholder="e.g., 192.168.1.200"
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
            Save Destination
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDestinationModal;