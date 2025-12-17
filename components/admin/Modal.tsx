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
          // Click outside listener to close the modal
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="rounded-xl shadow-2xl w-[90%] max-w-lg p-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            {(title) && (
              <div className={`flex items-start justify-between ${title ? 'mb-4' : ''}`}>
                {title && <h2 className="text-xl font-semibold">{title}</h2>}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 ml-auto p-1 rounded-full transition text-2xl leading-none"
                  aria-label="Close modal"
                > 
                  &times;
                </button>
              </div>
            )}
            
            <div className="mb-4">{children}</div>

            {onConfirm && (
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
                  onClick={onClose}
                >
                  {cancelLabel}
                </button>
                <button
                  className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}