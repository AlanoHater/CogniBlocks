
import React, { useRef, useEffect } from 'react';
import { GameState, LevelConfig } from '../types';

interface GridRendererProps {
  state: GameState;
  level: LevelConfig;
}

const GridRenderer: React.FC<GridRendererProps> = ({ state, level }) => {
  const { gridSize, targetPos, obstacles } = level;
  const { robotX, robotY, direction, isError, levelComplete, trail, lastAction } = state;
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isRobot = x === robotX && y === robotY;
      const isTarget = x === targetPos[0] && y === targetPos[1];
      const isObstacle = obstacles.some(obs => obs[0] === x && obs[1] === y);
      const isTrail = !isRobot && trail.some(t => t.x === x && t.y === y);

      let cellContent = null;
      
      // TRAIL (Breadcrumbs)
      if (isTrail) {
          cellContent = (
              <div className="absolute inset-0 flex items-center justify-center animate-fade-in-fast">
                  <div className="w-3 h-3 bg-indigo-200 rounded-full opacity-50 shadow-sm"></div>
              </div>
          )
      }

      if (isRobot) {
        // Robot SVG with Rotation
        const rotation = { 'N': 0, 'E': 90, 'S': 180, 'W': 270 }[direction];
        
        // Dynamic Animation Classes
        let animationClass = "transition-transform duration-500 ease-in-out";
        if (lastAction === 'jump') animationClass += " scale-[1.3] z-50"; // Visual pop for jump
        if (lastAction === 'crash') animationClass += " animate-shake text-red-600";
        
        cellContent = (
          <div 
            className={`w-full h-full flex items-center justify-center text-4xl z-20 relative drop-shadow-md ${animationClass}`}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {isError ? '💥' : '🤖'}
          </div>
        );
      } else if (isTarget) {
        cellContent = (
             <div className="text-3xl animate-bounce z-10 relative drop-shadow-sm">
                 🏁
             </div>
        );
      } else if (isObstacle) {
        cellContent = (
            <div className="text-3xl z-10 relative drop-shadow-md grayscale-[0.2]">
                🪨
            </div>
        );
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className={`
            relative w-full aspect-square border border-gray-100 rounded-xl
            flex items-center justify-center overflow-hidden transition-colors duration-300
            ${(x + y) % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
            ${isTarget && levelComplete ? 'bg-green-100 ring-4 ring-green-300 ring-inset shadow-[inset_0_0_20px_rgba(0,255,0,0.2)]' : ''}
            ${isRobot && isError ? 'bg-red-50 ring-4 ring-red-200 ring-inset' : ''}
            ${isRobot ? 'bg-indigo-50/50 shadow-inner' : ''}
          `}
        >
          {/* Coordinates background (subtle) */}
          <span className="absolute bottom-1 right-1.5 text-[9px] text-gray-300 font-mono pointer-events-none select-none">
            {x},{y}
          </span>
          {cellContent}
        </div>
      );
    }
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Visualizer Area */}
      <div className="bg-slate-50 p-6 rounded-2xl shadow-inner border border-gray-200 flex items-center justify-center flex-1 min-h-[350px] relative overflow-hidden">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="grid grid-cols-5 gap-3 w-full max-w-[350px] aspect-square relative z-10">
          {cells}
        </div>
      </div>

      {/* Console/Logs Area */}
      <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col h-48 shadow-lg border border-slate-800">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-400">CONSOLE_OUTPUT</span>
                {levelComplete && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">SUCCESS</span>}
                {isError && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">ERROR</span>}
            </div>
            <div className="flex gap-1.5 opacity-60">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
        </div>
        <div className="p-4 font-mono text-xs overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {state.logs.length === 0 && <span className="text-slate-600 animate-pulse">&gt; Sistema listo. Esperando input...</span>}
            {state.logs.map((log, i) => (
            <div key={i} className={`mb-1.5 border-l-2 pl-2 ${
                log.includes('Choque') ? 'text-red-400 border-red-500/50 bg-red-900/10' : 
                log.includes('META') ? 'text-green-400 border-green-500/50 bg-green-900/10' : 
                'text-slate-300 border-slate-700'
            }`}>
                <span className="text-slate-500 mr-2">{(i+1).toString().padStart(2, '0')}</span>
                {log}
            </div>
            ))}
            <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default GridRenderer;
