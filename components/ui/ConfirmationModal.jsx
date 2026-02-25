"use client";

import { Button, Modal } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  confirmColor = "danger",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showClose={false}
      className="bg-[#0f172a] border-slate-700"
    >
      <div className="p-6 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{message}</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-slate-400 hover:text-white border border-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant={confirmColor}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
