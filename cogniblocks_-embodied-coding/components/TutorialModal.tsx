import React from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-2xl font-display font-bold text-white relative z-10">¡Bienvenido a CogniBlocks! 🚀</h2>
          <p className="text-indigo-100 text-sm mt-1 relative z-10">Programación tangible para mentes creativas</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shrink-0">
              🏁
            </div>
            <div>
              <h3 className="font-bold text-gray-800">1. El Objetivo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Guía al robot 🤖 hasta la bandera 🏁 evitando los obstáculos 🪨.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl shrink-0">
              🧩
            </div>
            <div>
              <h3 className="font-bold text-gray-800">2. Construye tu Código</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Arrastra los bloques desde el panel izquierdo al <strong>Espacio de Trabajo</strong>. El orden importa: el robot ejecutará las acciones de arriba a abajo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl shrink-0">
              ▶️
            </div>
            <div>
              <h3 className="font-bold text-gray-800">3. Ejecuta y Aprende</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pulsa <strong>Ejecutar</strong> para ver tu programa en acción. Si fallas, ¡no pasa nada! Reorganiza los bloques y prueba otra vez.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform hover:scale-105 transition-all"
          >
            ¡Entendido, a programar!
          </button>
        </div>

      </div>
    </div>
  );
};

export default TutorialModal;