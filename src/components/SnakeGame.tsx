import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, RotateCcw, Play, Pause, AlertTriangle } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 100);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
        case 'r':
        case 'R': resetGame(); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 120);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 font-mono">
      <div className="flex items-center justify-between w-full max-w-[400px] px-2 border-b border-[#f0f]/30 pb-2">
        <div className="flex items-center gap-2 text-[#f0f]">
          <Activity size={16} className="animate-pulse" />
          <span className="text-xs uppercase tracking-tighter">NODE_SCORE:</span>
          <span className="text-lg font-black glitch-magenta">{score.toString().padStart(6, '0')}</span>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 border border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>

      <div 
        className="relative bg-black border-4 border-[#f0f] shadow-[0_0_30px_rgba(255,0,255,0.3)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#0ff]" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
            className={`w-full h-full ${
              i === 0 ? 'bg-[#f0f] shadow-[0_0_15px_#f0f]' : 'bg-[#0ff] shadow-[0_0_5px_#0ff]'
            } border border-black`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 90, 180, 270, 360],
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-full h-full bg-white shadow-[0_0_20px_#fff] border-2 border-[#f0f]"
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-10 p-6 text-center"
            >
              <AlertTriangle size={48} className="text-[#f0f] mb-4 animate-bounce" />
              <h2 className="mb-2 text-2xl font-black tracking-tighter text-[#f0f] glitch-magenta">SYSTEM_CRASH</h2>
              <p className="mb-6 text-[10px] text-[#0ff] uppercase tracking-widest">CORE_INTEGRITY_COMPROMISED</p>
              <button
                onClick={resetGame}
                className="px-8 py-4 border-2 border-[#f0f] text-[#f0f] font-bold hover:bg-[#f0f] hover:text-black transition-all uppercase tracking-widest"
              >
                [ REBOOT_SYSTEM ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="p-4 border-2 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all"
              >
                <Play size={32} />
              </button>
              <p className="mt-4 text-[8px] tracking-[0.5em] text-[#0ff] uppercase">Process_Suspended</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <p className="text-[8px] text-[#f0f]/40 uppercase tracking-[0.3em] animate-pulse">
          // VECTOR_INPUT_REQUIRED //
        </p>
      </div>
    </div>
  );
}
