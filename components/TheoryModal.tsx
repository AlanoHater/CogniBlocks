
import React from 'react';

interface TheoryModalProps {
  onClose: () => void;
}

const TheoryModal: React.FC<TheoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-indigo-900 p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg text-2xl">🧠</div>
             <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-white">La Mente Extendida</h2>
                <p className="text-indigo-200 text-xs uppercase tracking-widest">Ciencias Cognitivas</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          <div className="prose prose-indigo max-w-none text-gray-600">
            <blockquote className="bg-indigo-50 border-l-4 border-indigo-500 p-4 italic text-gray-700 mb-6 rounded-r-lg">
              "Una vez que reconocemos que el individuo, para pensar, manipula rutinariamente su entorno, la visión clásica de la mente como algo encerrado en el cerebro deja de ser plausible."
              <br/>
              <span className="text-sm font-bold not-italic text-indigo-800 mt-2 block">— Andy Clark & David Chalmers (1998)</span>
            </blockquote>

            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Qué es este entorno?</h3>
            <p className="mb-4">
              Esta aplicación está diseñada basándose en la teoría de la <strong>Cognición Extendida</strong> y el <strong>Externalismo Activo</strong>. 
              La idea central es que las herramientas que usamos (como este editor de bloques) no son solo "ayudas", sino <strong>partes literales de nuestro proceso de pensamiento</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">🧩 Manipulación Epistémica</h4>
                  <p className="text-sm">
                    Al arrastrar y reorganizar los bloques, no estás solo "escribiendo código". Estás <em>pensando con las manos</em>. 
                    Mover las piezas te permite descargar la carga cognitiva de tu memoria de trabajo al espacio físico de la pantalla.
                  </p>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">💾 Memoria Externa</h4>
                  <p className="text-sm">
                    El "Tablero" y el "Espacio de Trabajo" actúan como una memoria externa fiable. 
                    No necesitas recordar toda la secuencia de pasos en tu cabeza; la estructura está ahí fuera, visible y manipulable.
                  </p>
               </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Por qué es importante para aprender?</h3>
            <p>
              En la educación tradicional de programación, a menudo forzamos a los estudiantes a mantener estructuras sintácticas complejas en su cabeza (carga sintáctica). 
              Al usar bloques tangibles (virtualmente), eliminamos esa barrera y permitimos que la mente se "extienda" hacia la interfaz, 
              facilitando la comprensión pura de la lógica y la secuencia.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default TheoryModal;
