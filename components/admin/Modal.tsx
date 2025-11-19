'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-[90%] max-w-lg p-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            <div className="mb-4">{children}</div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={onClose}
              >
                {cancelLabel}
              </button>
              {onConfirm && (
                <button
                  className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
