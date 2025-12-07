'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveBarProps {
  show: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function SaveBar({ show, onSave, onCancel, isSaving = false }: SaveBarProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4">
            <p className="font-medium">Tienes cambios sin guardar</p>
            <div className="flex gap-2">
              <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                onClick={onSave}
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
