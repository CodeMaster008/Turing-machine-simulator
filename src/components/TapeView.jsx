import React from 'react';
import { BLANK } from '../examples';
import { ArrowDown } from 'lucide-react';

export default function TapeView({ tape, index, numTapes }) {
  // We want to render cells around the head so it looks like a continuous tape
  const renderRange = 15;
  const start = tape.head - renderRange;
  const end = tape.head + renderRange;

  const cellsRender = [];
  for (let i = start; i <= end; i++) {
    const symbol = tape.cells[i] || BLANK;
    const isHead = i === tape.head;
    const isWritten = tape.writtenCells.has(i);

    cellsRender.push(
      <div key={i} className="flex flex-col items-center">
        {isHead ? (
           <ArrowDown className={`mb-1 h-6 w-6 ${index === 0 ? 'text-blue-500' : 'text-purple-500'} animate-bounce duration-1000`} />
        ) : (
           <div className="h-6 mb-1" /> // Spacer
        )}
        <div 
          className={`
            w-12 h-12 flex items-center justify-center border-2 text-xl font-mono
            ${isHead ? (index === 0 ? 'border-blue-500' : 'border-purple-500') : 'border-slate-300 dark:border-slate-600'}
            ${isWritten ? 'bg-amber-100 dark:bg-amber-900/50' : 'bg-white dark:bg-slate-800'}
          `}
        >
          {symbol}
        </div>
        <div className="text-xs text-slate-400 mt-1">{i}</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden flex flex-col items-center py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl my-4">
      {numTapes > 1 && <h3 className="text-sm font-bold text-slate-500 absolute left-4">Tape {index + 1}</h3>}
      <div className="flex gap-1 overflow-x-auto p-4 snap-x snap-mandatory">
        {cellsRender}
      </div>
    </div>
  );
}
