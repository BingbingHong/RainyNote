import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, 
  Zap, 
  VolumeX, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface Memo {
  id: string;
  content: string;
  date: string;
}

interface MemoBoxProps {
  memos: Memo[];
  currentIndex: number;
  onUpdate: (content: string) => void;
  onAdd: () => void;
  onDelete: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const MemoBox: React.FC<MemoBoxProps> = ({
  memos,
  currentIndex,
  onUpdate,
  onAdd,
  onDelete,
  onPrev,
  onNext
}) => {
  const currentMemo = memos[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-[480px] h-[600px] min-w-[320px] min-h-[400px] bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-10 flex flex-col shadow-2xl relative resize overflow-hidden group/box"
    >
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-xs font-serif italic tracking-[0.6em] uppercase text-white/60">
          NOTE
        </h2>
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono tracking-widest text-cyan-400/40 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
          <span>{currentMemo.date}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.textarea
            key={currentMemo.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            value={currentMemo.content}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Type something..."
            className="w-full h-full bg-transparent border-none outline-none resize-none text-base font-sans text-white/70 placeholder:text-white/20 leading-relaxed scrollbar-hide"
          />
        </AnimatePresence>
      </div>

      {/* Toolbar */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-5 text-white/20">
          <button className="hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
          <button 
            onClick={onDelete}
            className="hover:text-red-400/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onAdd}
            className="hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        <div className="flex items-center gap-5 text-white/20">
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="hover:text-white disabled:opacity-5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={onNext}
              disabled={currentIndex === memos.length - 1}
              className="hover:text-white disabled:opacity-5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Resize Handle Hint */}
      <div className="absolute bottom-1 right-1 w-4 h-4 opacity-0 group-hover/box:opacity-20 transition-opacity pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-full border-r-2 border-b-2 border-white rounded-br-sm" />
      </div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-30" />
    </motion.div>
  );
};
