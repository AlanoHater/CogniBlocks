import React from 'react';
import { DraggableItem } from '../types';
import DraggableBlock from './DraggableBlock';

interface DropZoneProps {
  blocks: DraggableItem[];
  setBlocks: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
  onDragStart: (e: React.DragEvent, item: DraggableItem, index?: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ blocks, setBlocks, onDragStart, onDrop }) => {
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  return (
    <div 
      className="flex-1 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-4 min-h-[400px] flex flex-col relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {blocks.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          <p className="text-lg font-medium">Arrastra bloques aquí para empezar</p>
          <p className="text-sm">Construye tu lógica pieza a pieza</p>
        </div>
      )}

      <div className="z-10 w-full max-w-md mx-auto space-y-0">
        {blocks.map((block, index) => (
            <div key={block.id} className="group relative">
                <DraggableBlock 
                    item={block} 
                    onDragStart={(e, item) => onDragStart(e, item, index)} 
                />
                <button 
                    onClick={() => removeBlock(index)}
                    className="absolute -right-8 top-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Remove block"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DropZone;
