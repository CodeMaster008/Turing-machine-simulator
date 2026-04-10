import React from 'react';
import { machines } from '../examples';

export default function MachineSelect({ selectedId, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(machines).map(m => {
        const isSelected = selectedId === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className={`text-left p-5 rounded-2xl border transition-all relative ${
              isSelected 
                ? 'bg-[#f8f6fe] border-[#f8f6fe] text-black shadow-[0_0_20px_rgba(152,116,232,0.1)]'
                : 'bg-[#1c1c1c] hover:bg-[#252525] border-[#333] hover:border-[#555] text-white'
            }`}
          >
            <div className={`font-mono text-[10px] mb-3 tracking-widest font-bold ${
              isSelected ? 'text-[#9874e8]' : 'text-[#7e60bf]'
            }`}>
              {m.cardTag}
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-black' : 'text-white'}`}>
              {m.name}
            </h3>
            <p className={`text-sm leading-relaxed ${
              isSelected ? 'text-slate-400 font-medium' : 'text-[#a0a0a0]'
            } mb-4`}>
              {m.description}
            </p>
            <div className="flex gap-2">
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                isSelected ? 'bg-white border-slate-200 text-slate-400' : 'bg-transparent border-[#444] text-[#888]'
              }`}>
                {m.transitions.filter((v,i,a)=>a.findIndex(t=>(t.state === v.state))===i).length} states
              </span>
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                isSelected ? 'bg-white border-slate-200 text-slate-400' : 'bg-transparent border-[#444] text-[#888]'
              }`}>
                {m.transitions.length} trans
              </span>
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                isSelected ? 'bg-white border-slate-200 text-slate-400' : 'bg-transparent border-[#444] text-[#888]'
              }`}>
                {m.tapes} tape{m.tapes > 1 ? 's' : ''}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
