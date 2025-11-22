'use client';

import { motion } from 'framer-motion';

interface ConfirmDeleteModalProps {
  open: boolean;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  itemName,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <div className="bg-neutral-900 p-6 rounded w-[350px] border border-neutral-700">
        <h2 className="text-lg font-semibold text-red-400 mb-4">
          Delete {itemName}?
        </h2>

        <p className="text-gray-300 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
