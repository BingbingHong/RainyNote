import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RainShader } from './components/RainShader';
import { MemoBox } from './components/MemoBox';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Upload, 
  Droplets, 
  Cloud, 
  Maximize2, 
  RotateCcw, 
  X, 
  Image as ImageIcon, 
  Video,
  Wind
} from 'lucide-react';

interface Memo {
  id: string;
  content: string;
  date: string;
}

const formatDate = () => {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const y = String(now.getFullYear()).slice(-2);
  return `${m}.${d}.${y}`;
};

export default function App() {
  const [rainAmount, setRainAmount] = useState(0.5);
  const [fogAmount, setFogAmount] = useState(0.8);
  const [refraction, setRefraction] = useState(0.5);
  const [speed, setSpeed] = useState(1.0);
  const [textureUrl, setTextureUrl] = useState<string | null>("https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80");
  const [isVideo, setIsVideo] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Memo State
  const [memos, setMemos] = useState<Memo[]>([
    { id: '1', content: '', date: formatDate() }
  ]);
  const [currentMemoIndex, setCurrentMemoIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setTextureUrl(url);
    setIsVideo(file.type.startsWith('video/'));
  };

  const resetSettings = () => {
    setRainAmount(0.5);
    setFogAmount(0.8);
    setRefraction(0.5);
    setSpeed(1.0);
  };

  // Memo Handlers
  const handleUpdateMemo = (content: string) => {
    const newMemos = [...memos];
    newMemos[currentMemoIndex].content = content;
    setMemos(newMemos);
  };

  const handleAddMemo = () => {
    const newMemo = {
      id: Math.random().toString(36).substr(2, 9),
      content: '',
      date: formatDate()
    };
    setMemos([...memos, newMemo]);
    setCurrentMemoIndex(memos.length);
  };

  const handleDeleteMemo = () => {
    if (memos.length === 1) {
      handleUpdateMemo('');
      return;
    }
    const newMemos = memos.filter((_, idx) => idx !== currentMemoIndex);
    setMemos(newMemos);
    setCurrentMemoIndex(Math.max(0, currentMemoIndex - 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white">
      {/* Main Shader Background */}
      <div className="absolute inset-0 z-0">
        <RainShader 
          textureUrl={textureUrl} 
          isVideo={isVideo} 
          rainAmount={rainAmount} 
          fogAmount={fogAmount} 
          refraction={refraction}
          speed={speed}
        />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center p-8">
        {/* Memo Box in Center */}
        <div className="pointer-events-auto">
          <MemoBox 
            memos={memos}
            currentIndex={currentMemoIndex}
            onUpdate={handleUpdateMemo}
            onAdd={handleAddMemo}
            onDelete={handleDeleteMemo}
            onPrev={() => setCurrentMemoIndex(Math.max(0, currentMemoIndex - 1))}
            onNext={() => setCurrentMemoIndex(Math.min(memos.length - 1, currentMemoIndex + 1))}
          />
        </div>

        {/* Hidden File Input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*,video/*" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        {/* Bottom Controls (Floating Icon) */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <AnimatePresence mode="wait">
            {!isPanelOpen ? (
              <motion.button
                key="settings-btn"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                onClick={() => setIsPanelOpen(true)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 group"
              >
                <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
              </motion.button>
            ) : (
              <motion.div
                key="control-panel"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-80 bg-white/3 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Atmosphere</h2>
                  <button 
                    onClick={() => setIsPanelOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Rain Intensity */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase text-white/40">
                      <span className="flex items-center gap-2"><Droplets className="w-3 h-3" /> Rain Intensity</span>
                      <span>{Math.round(rainAmount * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.01" 
                      value={rainAmount} 
                      onChange={(e) => setRainAmount(parseFloat(e.target.value))}
                      className="w-full accent-blue-500 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Fog Amount */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase text-white/40">
                      <span className="flex items-center gap-2"><Cloud className="w-3 h-3" /> Fog Density</span>
                      <span>{Math.round(fogAmount * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.01" 
                      value={fogAmount} 
                      onChange={(e) => setFogAmount(parseFloat(e.target.value))}
                      className="w-full accent-blue-400 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Refraction */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase text-white/40">
                      <span className="flex items-center gap-2"><Maximize2 className="w-3 h-3" /> Refraction</span>
                      <span>{Math.round(refraction * 100)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.01" 
                      value={refraction} 
                      onChange={(e) => setRefraction(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Speed */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-mono uppercase text-white/40">
                      <span className="flex items-center gap-2"><Wind className="w-3 h-3" /> Time Scale</span>
                      <span>{speed.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.1" max="3" step="0.1" 
                      value={speed} 
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-[2] flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <button 
                    onClick={resetSettings}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}
