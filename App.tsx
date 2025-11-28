
import React, { useState } from 'react';
import { BlockCategory, BlockDefinition, DraggableItem, GameState, LevelConfig } from './types';
import DraggableBlock from './components/DraggableBlock';
import DropZone from './components/DropZone';
import GridRenderer from './components/GridRenderer';
import TutorialModal from './components/TutorialModal';
import TheoryModal from './components/TheoryModal';
import { runSimulation, INITIAL_LEVEL, getInitialState, generateRandomLevel } from './utils/gameLogic';
import { playSound } from './utils/soundEngine';

// Initial Palette Definitions
const DEFINITIONS: BlockDefinition[] = [
  { id: 'def_1', label: 'Mover Adelante', category: BlockCategory.MOTION, icon: '⬆️', command: 'move_forward' },
  { id: 'def_2', label: 'Girar Izquierda', category: BlockCategory.MOTION, icon: '↩️', command: 'turn_left' },
  { id: 'def_3', label: 'Girar Derecha', category: BlockCategory.MOTION, icon: '↪️', command: 'turn_right' },
  { id: 'def_4', label: 'Saltar', category: BlockCategory.MOTION, icon: '⏫', command: 'jump' },
];

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(INITIAL_LEVEL);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<DraggableItem[]>([]);
  const [gameState, setGameState] = useState<GameState>(getInitialState(INITIAL_LEVEL));
  const [isRunning, setIsRunning] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{item: DraggableItem, index?: number} | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showTheory, setShowTheory] = useState(false);

  // --- Drag & Drop Handlers ---
  
  const handleDragStart = (e: React.DragEvent, item: DraggableItem, index?: number) => {
    playSound('drag');
    setDraggedItem({ item, index });
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    playSound('drop');

    const newBlocks = [...workspaceBlocks];

    if (draggedItem.index !== undefined) {
      newBlocks.splice(draggedItem.index, 1);
      newBlocks.push(draggedItem.item);
    } else {
      // New item from palette
      const newItem: DraggableItem = {
        ...draggedItem.item,
        id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      newBlocks.push(newItem);
    }

    setWorkspaceBlocks(newBlocks);
    setDraggedItem(null);
  };

  // --- Level Management ---

  const handleNewLevel = () => {
    const newLevel = generateRandomLevel();
    setCurrentLevel(newLevel);
    setGameState(getInitialState(newLevel));
    setIsRunning(false);
    playSound('drop'); // Subtle feedback for level change
  };

  // --- Execution ---

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    // Reset state before run
    setGameState(getInitialState(currentLevel));
    
    await runSimulation(
      workspaceBlocks, 
      currentLevel, 
      setGameState,
      (actionType) => playSound(actionType), // Sound callback
      600
    );
    
    setIsRunning(false);
  };

  const handleReset = () => {
    setGameState(getInitialState(currentLevel));
    setIsRunning(false);
  };

  const handleClear = () => {
      setWorkspaceBlocks([]);
      handleReset();
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            🧩
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-gray-900 leading-none tracking-tight">CogniBlocks</h1>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">Aprendizaje Corporizado</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
            <button 
                onClick={() => setShowTheory(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all"
            >
                <span className="text-lg">🧠</span>
                <span className="hidden sm:inline">La Ciencia</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button 
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-100 transition-all hover:scale-105"
            >
                <span>❓</span>
                <span className="hidden sm:inline">Cómo Jugar</span>
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Palette (Source) */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-full flex flex-col">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Bloques Disponibles</h2>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {DEFINITIONS.map(def => (
                <DraggableBlock 
                  key={def.id} 
                  item={{
                    id: def.id,
                    defId: def.id,
                    label: def.label,
                    category: def.category,
                    command: def.command
                  }}
                  onDragStart={handleDragStart} 
                  isPaletteItem 
                />
              ))}
            </div>
            
            {/* Visual Hint */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center opacity-60 hover:opacity-100 transition-opacity cursor-help" title="Al manipular objetos físicos (o virtuales), extendemos nuestra mente al entorno.">
                 <div className="text-2xl mb-1">🤏</div>
                 <p className="text-[9px] text-gray-400 font-medium leading-tight">
                     Arrastra para pensar
                 </p>
            </div>
          </div>
        </section>

        {/* Center: Workspace (Target) */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden relative">
             {/* Toolbar */}
             <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🛠️</span>
                    <h2 className="text-sm font-bold font-display text-gray-700">Espacio de Trabajo</h2>
                    <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-100 ml-2">Memoria Externa</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleClear}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1"
                        title="Borrar todos los bloques"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Limpiar
                    </button>
                </div>
             </div>
             
             {/* Drop Area */}
             <div className="flex-1 p-4 flex flex-col bg-slate-50/30">
                 <DropZone 
                    blocks={workspaceBlocks} 
                    setBlocks={setWorkspaceBlocks} 
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                />
             </div>

             {/* Action Bar */}
             <div className="p-4 bg-white border-t border-gray-100 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10">
                <button
                onClick={handleRun}
                disabled={isRunning || workspaceBlocks.length === 0}
                className={`
                    flex-1 py-3 px-6 rounded-xl font-bold font-display text-lg shadow-lg transform transition-all active:scale-[0.98]
                    flex items-center justify-center gap-2 group border-b-4
                    ${isRunning 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 border-indigo-800 hover:bg-indigo-500 text-white shadow-indigo-200'
                    }
                `}
                >
                    {isRunning ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-sm">Procesando...</span>
                        </div>
                    ) : (
                        <>
                            <span className="group-hover:translate-x-1 transition-transform">▶</span> 
                            EJECUTAR PROGRAMA
                        </>
                    )}
                </button>
                
                <button
                onClick={handleReset}
                disabled={isRunning}
                className="px-5 py-3 bg-white border-2 border-slate-200 border-b-4 text-slate-600 rounded-xl font-bold hover:bg-slate-50 active:scale-95 transition-all"
                title="Reiniciar robot a posición inicial"
                >
                ↺
                </button>
             </div>
          </div>
        </section>

        {/* Right: Output */}
        <section className="lg:col-span-4 flex flex-col gap-4">
           
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex justify-between items-center px-5 py-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mundo Físico (Simulación)</span>
              <button 
                onClick={handleNewLevel}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-indigo-100"
            >
                🎲 Nuevo Nivel
            </button>
           </div>

           <div className="flex-1 flex flex-col">
              <GridRenderer state={gameState} level={currentLevel} />
           </div>

        </section>

      </main>

      {/* Overlays */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {showTheory && <TheoryModal onClose={() => setShowTheory(false)} />}
    </div>
  );
};

export default App;
