import React from 'react';
import { BLANK } from '../../examples';

export default function FormalMTab({ machineDef }) {
  const states = Array.from(new Set(machineDef.transitions.flatMap(t => [t.state, t.toState])));
  if (!states.includes(machineDef.startState)) states.push(machineDef.startState);
  if (!states.includes(machineDef.acceptState)) states.push(machineDef.acceptState);
  if (!states.includes(machineDef.rejectState)) states.push(machineDef.rejectState);

  const inputSymbols = machineDef.priors.filter(s => s !== BLANK);
  const tapeSymbols = machineDef.priors; // Technically Γ includes Σ and BLANK + extra symbols

  const formatSet = (setArr) => `{ ${setArr.join(', ')} }`;

  return (
    <div className="bg-[#222] border border-[#333] rounded-xl p-8">
      <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-6">
        Formal Definition of M
      </h3>
      
      <div className="bg-[#1c1c1c] border border-[#333] rounded-xl p-6 font-mono text-sm leading-8 text-[#a0a0a0]">
        <p className="text-white text-lg mb-4">
          <span className="text-[#9874e8] font-bold">M</span> = (Q, Σ, Γ, δ, q<sub className="text-[10px]">0</sub>, q<sub className="text-[10px]">accept</sub>, q<sub className="text-[10px]">reject</sub>)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="text-white font-bold w-32 inline-block">Q (States):</span> 
            <span className="text-[#4ea8de]">{formatSet(states)}</span>
          </div>
          <div>
            <span className="text-white font-bold w-32 inline-block">Σ (Input):</span> 
            <span className="text-[#f6ad55]">{formatSet(inputSymbols)}</span>
          </div>
          <div>
            <span className="text-white font-bold w-32 inline-block">Γ (Tape):</span> 
            <span className="text-[#ed64a6]">{formatSet(tapeSymbols)}</span>
          </div>
          <div>
            <span className="text-white font-bold w-32 inline-block">q<sub className="text-[10px] bottom-0">0</sub> (Start):</span> 
            <span className="bg-[#333] px-2 py-1 rounded text-white">{machineDef.startState}</span>
          </div>
          <div>
            <span className="text-white font-bold w-32 inline-block">q<sub className="text-[10px] bottom-0">accept</sub>:</span> 
            <span className="bg-[#225032] border border-[#2f855a] px-2 py-1 rounded text-[#9ae6b4]">{machineDef.acceptState}</span>
          </div>
          <div>
            <span className="text-white font-bold w-32 inline-block">q<sub className="text-[10px] bottom-0">reject</sub>:</span> 
            <span className="bg-[#652b2b] border border-[#9b2c2c] px-2 py-1 rounded text-[#feb2b2]">{machineDef.rejectState}</span>
          </div>
        </div>

        <div className="mt-8 border-t border-[#333] pt-6">
           <span className="text-white font-bold block mb-2">δ (Transition Function):</span>
           <span className="text-[#888] font-mono text-xs">
             δ : Q × Γ{machineDef.tapes > 1 ? `^${machineDef.tapes}` : ''} → Q × Γ{machineDef.tapes > 1 ? `^${machineDef.tapes}` : ''} × {'{L, R, S}'}{machineDef.tapes > 1 ? `^${machineDef.tapes}` : ''}
           </span>
           <p className="mt-2 text-[#555] italic text-xs">
             See the Execution tab for the complete explicit mapping table of δ.
           </p>
        </div>
      </div>
    </div>
  );
}
