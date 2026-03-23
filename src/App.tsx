import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2, Zap, Terminal, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans scanlines noise relative">
      {/* Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[url('https://media.giphy.com/media/oEI9uWUPr9WUM/giphy.gif')] mix-blend-screen" />

      {/* Header / System Status */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b-2 border-[#f0f] bg-black/80 tear">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#f0f] shadow-[0_0_20px_#f0f] animate-pulse">
            <Terminal className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-black tracking-tighter uppercase glitch-magenta">
              SYSTEM::RHYTHM_OS
            </h1>
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-[#f0f]" />
              <p className="text-[8px] font-mono text-[#f0f] uppercase tracking-[0.3em]">
                KERNEL_STATUS: CRITICAL_OVERLOAD
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[10px] font-mono uppercase tracking-[0.4em] text-[#0ff]/60">
          <a href="#" className="hover:text-[#f0f] hover:glitch-magenta transition-all">[ DATA_LOGS ]</a>
          <a href="#" className="hover:text-[#f0f] hover:glitch-magenta transition-all">[ SIGNAL_PATH ]</a>
          <a href="#" className="hover:text-[#f0f] hover:glitch-magenta transition-all">[ CORE_CONFIG ]</a>
        </div>

        <button className="p-2 text-[#f0f] hover:scale-125 transition-transform">
          <Github size={24} />
        </button>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Machine Specs */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="p-4 border-2 border-[#f0f] bg-black/40 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-ping" />
            <div className="flex items-center gap-3 mb-4 text-[#f0f]">
              <Music size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest font-bold">AUDIO_STREAM::INCOMING</h2>
            </div>
            <p className="text-[10px] font-mono text-[#0ff]/80 leading-relaxed uppercase">
              DECODING_SYNTH_WAVE_PACKETS...
              BITRATE: 1024KBPS
              ENCRYPTION: NONE
              RHYTHM_SYNC: ACTIVE
            </p>
          </div>

          <div className="p-4 border-2 border-[#0ff] bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4 text-[#0ff]">
              <Gamepad2 size={16} />
              <h2 className="text-[10px] font-mono uppercase tracking-widest font-bold">INPUT_MAPPING</h2>
            </div>
            <ul className="space-y-4 text-[8px] font-mono text-[#0ff]/40 uppercase tracking-widest">
              <li className="flex justify-between border-b border-[#0ff]/10 pb-1">
                <span>VECTOR_X_Y</span> 
                <span className="text-[#f0f] font-bold">[ ARROWS ]</span>
              </li>
              <li className="flex justify-between border-b border-[#0ff]/10 pb-1">
                <span>HALT_PROCESS</span> 
                <span className="text-[#f0f] font-bold">[ SPACE ]</span>
              </li>
              <li className="flex justify-between border-b border-[#0ff]/10 pb-1">
                <span>REBOOT_CORE</span> 
                <span className="text-[#f0f] font-bold">[ R_KEY ]</span>
              </li>
            </ul>
          </div>

          <div className="p-4 border-2 border-dashed border-[#f0f]/30">
            <div className="text-[8px] font-mono text-[#f0f]/60 animate-pulse">
              WARNING: VISUAL_TEARING_DETECTED. 
              DO_NOT_DISCONNECT_NEURAL_LINK.
            </div>
          </div>
        </motion.div>

        {/* Center Column: The Core (Snake) */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 flex justify-center relative"
        >
          <div className="absolute -inset-4 border-2 border-[#f0f]/20 pointer-events-none animate-pulse" />
          <SnakeGame />
        </motion.div>

        {/* Right Column: Signal Processor (Music) */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 flex justify-center lg:justify-end"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* System Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-end bg-black/80 border-t border-[#f0f]/20">
        <div className="font-mono text-[8px] text-[#f0f] uppercase tracking-[0.5em] animate-pulse">
          // CAUTION: MACHINE_SENTIENCE_PROBABILITY: 98.4% //
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-[#0ff]" 
              style={{ 
                height: `${Math.random() * 40 + 10}px`,
                opacity: Math.random() * 0.5 + 0.1
              }} 
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
