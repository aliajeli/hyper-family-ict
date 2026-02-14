'use client';

import { LoginPage } from '@/components/auth';
import { BottomSection, MainLayout, TopSection } from '@/components/layout';
import { Modal } from '@/components/ui';
import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';

// Import All Modals
import AddDestinationModal from '@/components/destinations/AddDestinationModal';
import EquipmentsModal from '@/components/equipments/EquipmentsModal';
import CopyModal from '@/components/operations/CopyModal';
import DeleteModal from '@/components/operations/DeleteModal';
import RenameModal from '@/components/operations/RenameModal';
import ReplaceModal from '@/components/operations/ReplaceModal';
import AddSystemModal from '@/components/systems/AddSystemModal';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  
  // Modal states
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [showEquipments, setShowEquipments] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isAuthenticated) return <LoginPage />;

  return (
    <MainLayout>
      <TopSection
        onAddSystem={() => setShowAddSystem(true)}
        onAddDestination={() => setShowAddDestination(true)}
        onCopy={() => setShowCopy(true)}
        onDelete={() => setShowDelete(true)}
        onRename={() => setShowRename(true)}
        onReplace={() => setShowReplace(true)}
        onEquipments={() => setShowEquipments(true)}
        onAbout={() => setShowAbout(true)}
        onSettings={() => setShowSettings(true)}
      />

      <BottomSection />

      {/* Operation Modals */}
      <AddSystemModal isOpen={showAddSystem} onClose={() => setShowAddSystem(false)} />
      <AddDestinationModal isOpen={showAddDestination} onClose={() => setShowAddDestination(false)} />
      <CopyModal isOpen={showCopy} onClose={() => setShowCopy(false)} />
      <DeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} />
      <RenameModal isOpen={showRename} onClose={() => setShowRename(false)} />
      <ReplaceModal isOpen={showReplace} onClose={() => setShowReplace(false)} />
      
      {/* Equipments Modal */}
      <EquipmentsModal isOpen={showEquipments} onClose={() => setShowEquipments(false)} />

      {/* About Modal */}
      <Modal isOpen={showAbout} onClose={() => setShowAbout(false)} title="About">
        <div className="space-y-4 text-center py-6">
            <h2 className="text-xl font-bold text-accent">Hyper Family ICT Manager</h2>
            <p className="text-text-secondary">Version 1.0.0</p>
            <div className="p-4 bg-bg-tertiary rounded-lg border border-border inline-block text-left">
                <p><strong>Author:</strong> Ali Ajeli Lahiji</p>
                <p><strong>Email:</strong> lahiji.ali@hyperfamili.com</p>
                <p><strong>Tech Stack:</strong> Next.js, Tailwind, Electron</p>
            </div>
            <p className="text-xs text-text-muted mt-4">© 2024 Hyper Family Chain Stores. All rights reserved.</p>
        </div>
      </Modal>

      {/* Settings Modal Placeholder */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings">
        <p>Settings page coming soon...</p>
      </Modal>

    </MainLayout>
  );
}