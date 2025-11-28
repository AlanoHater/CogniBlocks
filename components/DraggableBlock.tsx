import React from 'react';
import { DraggableItem, BlockCategory } from '../types';

interface DraggableBlockProps {
  item: DraggableItem;
  onDragStart: (e: React.DragEvent, item: DraggableItem) => void;
  isPaletteItem?: boolean;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ item, onDragStart, isPaletteItem = false }) => {
  
  const getColors = (cat: BlockCategory) => {
    switch(cat) {
      case BlockCategory.MOTION: return 'bg-block-motion border-blue-600 text-white';
      case BlockCategory.CONTROL: return 'bg-block-control border-yellow-600 text-white';
      case BlockCategory.LOOKS: return 'bg-block-looks border-purple-600 text-white';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      className={`
        relative flex items-center px-4 py-3 mb-2 rounded-lg 
        cursor-grab active:cursor-grabbing select-none
        font-display font-medium shadow-block transition-transform hover:scale-[1.02]
        border-b-4 ${getColors(item.category)}
        ${isPaletteItem ? 'w-full' : 'w-full max-w-md'}
      `}
    >
      {/* Puzzle piece connector visual (left inset) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-3 h-4 bg-inherit rounded-r-full opacity-0"></div>

      {/* Icon (Simplified) */}
      <span className="mr-3 text-lg opacity-90">
        {item.command === 'move_forward' && '⬆️'}
        {item.command === 'turn_left' && '↩️'}
        {item.command === 'turn_right' && '↪️'}
        {item.command === 'jump' && '⏫'}
      </span>
      
      <span>{item.label}</span>
      
      {/* Puzzle piece connector visual (bottom out) - Purely decorative for "feel" */}
      { !isPaletteItem && (
        <div className="absolute bottom-[-6px] left-6 w-4 h-2 bg-inherit rounded-b-full"></div>
      )}
    </div>
  );
};

export default DraggableBlock;
