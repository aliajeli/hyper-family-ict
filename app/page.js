"use client";

import AboutModal from "@/components/about/AboutModal"; // 👈 Import
import { LoginPage } from "@/components/auth";
import { BottomSection, MainLayout, TopSection } from "@/components/layout";
import SettingsModal from "@/components/settings/SettingsModal"; // 👈 Import
import { Modal } from "@/components/ui";
import { useMonitoring } from "@/hooks/useMonitoring"; // 👈 Import
import { useAuthStore, useDestinationStore, useSystemStore } from "@/store"; // 👈 Import stores
import { useEffect, useState } from "react";

// Import All Modals
import AddDestinationModal from "@/components/destinations/AddDestinationModal";
import EquipmentsModal from "@/components/equipments/EquipmentsModal";
import CopyModal from "@/components/operations/CopyModal";
import DeleteModal from "@/components/operations/DeleteModal";
import RenameModal from "@/components/operations/RenameModal";
import ReplaceModal from "@/components/operations/ReplaceModal";
import AddSystemModal from "@/components/systems/AddSystemModal";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const { fetchDestinations } = useDestinationStore(); // 👈
  const { fetchSystems } = useSystemStore(); // 👈

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

  useMonitoring();

  useEffect(() => {
    setMounted(true);
    // 👇 Fetch initial data on app load
    if (isAuthenticated) {
      fetchDestinations();
      fetchSystems();
    }
  }, [isAuthenticated]);

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
      <AddSystemModal
        isOpen={showAddSystem}
        onClose={() => setShowAddSystem(false)}
      />
      <AddDestinationModal
        isOpen={showAddDestination}
        onClose={() => setShowAddDestination(false)}
      />
      <CopyModal isOpen={showCopy} onClose={() => setShowCopy(false)} />
      <DeleteModal isOpen={showDelete} onClose={() => setShowDelete(false)} />
      <RenameModal isOpen={showRename} onClose={() => setShowRename(false)} />
      <ReplaceModal
        isOpen={showReplace}
        onClose={() => setShowReplace(false)}
      />

      {/* Equipments Modal */}
      <EquipmentsModal
        isOpen={showEquipments}
        onClose={() => setShowEquipments(false)}
      />

      {/* About Modal */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </MainLayout>
  );
}
