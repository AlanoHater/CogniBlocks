import React, { useState, useEffect } from 'react';
import { DraggableItem } from '../types';
import { analyzeCode } from '../services/geminiService';

interface GeminiTutorProps {
  blocks: DraggableItem[];
}

const GeminiTutor: React.FC<GeminiTutorProps> = ({ blocks }) => {
  const [feedback, setFeedback] = useState<string>("¡Hola! Arrastra algunos bloques y te ayudaré.");
  const [loading, setLoading] = useState(false);
  // Debounce effect to avoid calling API on every single drag
  const [debouncedBlocks, setDebouncedBlocks] = useState<DraggableItem[]>(blocks);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBlocks(blocks);
    }, 2000); // 2 second delay after last change

    return () => clearTimeout(handler);
  }, [blocks]);

  useEffect(() => {
    if (debouncedBlocks.length > 0) {
      const fetchFeedback = async () => {
        setLoading(true);
        const response = await analyzeCode(debouncedBlocks);
        setFeedback(response);
        setLoading(false);
      };
      fetchFeedback();
    } else {
        setFeedback("El espacio de trabajo está vacío. ¡Empieza a construir!");
    }
  }, [debouncedBlocks]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">
          🧠
        </div>
        <div>
          <h3 className="font-display font-bold text-gray-800">Tutor IA</h3>
          <p className="text-xs text-indigo-600 font-medium">Analizando lógica...</p>
        </div>
      </div>
      
      <div className={`
        relative bg-white rounded-lg p-4 text-sm text-gray-600 leading-relaxed shadow-inner min-h-[80px]
        transition-all duration-300
        ${loading ? 'opacity-70' : 'opacity-100'}
      `}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
        <p>{feedback}</p>
      </div>
      <div className="mt-2 text-[10px] text-gray-400 text-center">
        Powered by Google Gemini
      </div>
    </div>
  );
};

export default GeminiTutor;
