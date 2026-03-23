import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Radio } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DRIFT.MP3',
    artist: 'SYNTH_AI_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400',
  },
  {
    id: '2',
    title: 'CYBER_PULSE.WAV',
    artist: 'GHOST_SHELL',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400',
  },
  {
    id: '3',
    title: 'GRID_LOCK.EXE',
    artist: 'RETRO_VOID',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md p-4 bg-black border-2 border-[#f0f] shadow-[0_0_20px_rgba(255,0,255,0.2)] font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#f0f]/30 animate-scan" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col items-center gap-4">
        {/* Album Art */}
        <div className="relative">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, filter: 'grayscale(1)' }}
            animate={{ opacity: 1, filter: 'grayscale(0)' }}
            className="w-40 h-40 border-2 border-[#0ff] shadow-[0_0_15px_#0ff]"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="object-cover w-full h-full opacity-80 mix-blend-screen"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {isPlaying && (
            <div className="absolute top-2 right-2 flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
                  className="w-1 bg-[#f0f]"
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center w-full">
          <h3 className="text-sm font-black text-[#f0f] glitch-magenta truncate px-2">{currentTrack.title}</h3>
          <p className="text-[#0ff] text-[8px] uppercase tracking-[0.3em] mt-1">
            SOURCE: {currentTrack.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-1">
          <div className="h-1 w-full bg-[#f0f]/10 border border-[#f0f]/20">
            <motion.div
              className="h-full bg-[#f0f] shadow-[0_0_10px_#f0f]"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[6px] text-[#f0f]/40 uppercase">
            <span>00:00</span>
            <span>DATA_STREAM_ACTIVE</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="p-1 text-[#0ff] hover:text-[#f0f] transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 flex items-center justify-center border-2 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,255,0.3)]"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button
            onClick={handleNext}
            className="p-1 text-[#0ff] hover:text-[#f0f] transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#0ff]/20 text-[6px] uppercase tracking-[0.4em]">
          <Radio size={10} className="animate-pulse" />
          <span>SIGNAL_STRENGTH: OPTIMAL</span>
        </div>
      </div>
    </div>
  );
}
