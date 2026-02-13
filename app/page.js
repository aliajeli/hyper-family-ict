'use client';

import { LoginPage } from '@/components/auth';
import { BottomSection, MainLayout, TopSection } from '@/components/layout';
import { Modal } from '@/components/ui';
import { useAuthStore } from '@/store';
import { useEffect, useState } from 'react';

// Import page modals (will create later)
// import { AddSystemModal } from '@/components/systems';
// import { AddDestinationModal } from '@/components/destinations';


// Import newly created components
import AddDestinationModal from '@/components/destinations/AddDestinationModal';
import CopyModal from '@/components/operations/CopyModal';
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

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <MainLayout>
      {/* Top Section - Action Buttons */}
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

      {/* Bottom Section - Monitoring */}
      <BottomSection />

      {/* Modals */}
      <AddSystemModal
        isOpen={showAddSystem}
        onClose={() => setShowAddSystem(false)}
        title="Add System"
        size="lg"
      >
      </AddSystemModal>

      <AddDestinationModal
        isOpen={showAddDestination}
        onClose={() => setShowAddDestination(false)}
        title="Add Destination"
        size="lg"
      >
      </AddDestinationModal>

      <CopyModal
        isOpen={showCopy}
        onClose={() => setShowCopy(false)}
        title="Copy Files"
        size="xl"
      >
      </CopyModal>

      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Files"
        size="xl"
      >
        <p className="text-text-secondary">Delete operation will be here...</p>
      </Modal>

      <Modal
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        title="Rename Files"
        size="lg"
      >
        <p className="text-text-secondary">Rename operation will be here...</p>
      </Modal>

      <Modal
        isOpen={showReplace}
        onClose={() => setShowReplace(false)}
        title="Replace Files"
        size="xl"
      >
        <p className="text-text-secondary">Replace operation will be here...</p>
      </Modal>

      <Modal
        isOpen={showEquipments}
        onClose={() => setShowEquipments(false)}
        title="Equipments"
        size="xl"
      >
        <p className="text-text-secondary">Equipments list will be here...</p>
      </Modal>

      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="About"
        size="md"
      >
        <p className="text-text-secondary">About page will be here...</p>
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
        size="lg"
      >
        <p className="text-text-secondary">Settings page will be here...</p>
      </Modal>
    </MainLayout>
  );
}