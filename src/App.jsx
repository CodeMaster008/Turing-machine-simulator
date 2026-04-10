import React, { useState, useEffect } from 'react';
import { machines } from './examples';
import { useTuringMachine } from './useTuringMachine';
import TapeView from './components/TapeView';
import DataPanel from './components/DataPanel';
import MachineSelect from './components/MachineSelect';
import { Play, Pause, FastForward, RotateCcw, StepForward, MoreHorizontal } from 'lucide-react';

export default function App() {
  const [machineDef, setMachineDef] = useState(machines.palindrome);
  const [inputVal, setInputVal] = useState('');

  // Force dark mode contextually
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const {
    tapes,
    state,
    status,
    stats,
    logs,
    history,
    currentStepIndex,
    setScrubberIndex,
    speed,
    step,
    run,
    pause,
    reset,
    fastForward,
    setSpeed
  } = useTuringMachine(machineDef);

  useEffect(() => {
    const init = Array.isArray(machineDef.initialInput) ? machineDef.initialInput.join(',') : machineDef.initialInput;
    setInputVal(init);
    reset(machineDef.initialInput);
  }, [machineDef, reset]);

  const handleLoad = () => {
    let finalInput;
    if (machineDef.tapes > 1) {
      finalInput = inputVal.split(',').map(s => s.trim());
      while (finalInput.length < machineDef.tapes) finalInput.push('');
    } else {
      finalInput = inputVal;
    }
    reset(finalInput);
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-slate-200 p-8 font-sans" onClick={(e) => { if(showMenu) setShowMenu(false); }}>
      <div className="max-w-[1200px] mx-auto">
        <header className="flex flex-col items-center justify-center mb-10 relative">
          <div className="flex justify-between w-full absolute top-0" onClick={e => e.stopPropagation()}>
             <div />
             <div className="relative">
               <MoreHorizontal 
                 className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" 
                 onClick={() => setShowMenu(!showMenu)} 
               />
               {showMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-[#222] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                   <button className="w-full text-left px-4 py-3 text-sm text-[#a0a0a0] hover:bg-[#333] hover:text-white transition-colors border-b border-[#333]">
                      Import Machine state
                   </button>
                   <button className="w-full text-left px-4 py-3 text-sm text-[#a0a0a0] hover:bg-[#333] hover:text-white transition-colors border-b border-[#333]">
                      Export Board
                   </button>
                   <button className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#333] transition-colors">
                      Clear memory cache
                   </button>
                 </div>
               )}
             </div>
          </div>
          <h2 className="text-[#9874e8] font-mono text-xs font-bold tracking-widest uppercase mb-2">
            Theory of Computation Project
          </h2>
          <h1 className="text-3xl font-medium tracking-wide text-white mb-3">
            Turing Machine Simulator
          </h1>
          <p className="text-[#a0a0a0] text-sm tracking-wide">
            7 machines · space-time diagram · ID chain · complexity analysis · formal definition · custom TM builder
          </p>
        </header>

        <MachineSelect selectedId={machineDef.id} onSelect={setMachineDef} />

        <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mt-6">
          <div className="flex justify-between items-center bg-[#252525] p-2 rounded-xl border border-[#333]">
             <div className="flex items-center gap-3 w-3/4 px-4">
                <span className="text-[#a0a0a0] text-sm">Input:</span>
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-grow font-mono bg-[#1c1c1c] border border-[#333] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#555] text-sm"
                />
             </div>
             <button onClick={handleLoad} className="bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-white px-8 py-2 rounded-lg text-sm transition font-medium mr-2">
               Load
             </button>
          </div>

          <div className="flex border border-[#333] bg-[#222] rounded-xl px-4 py-3 gap-4 items-center">
             <div className="px-3 py-1 font-mono text-xs font-bold bg-[#333] text-white rounded-full border border-[#444]">READY</div>
             <div className="px-3 py-1 font-mono text-xs font-bold border border-[#444] text-[#4ea8de] rounded-full">q: {state}</div>
             <div className="px-3 py-1 font-mono text-xs font-bold border border-[#444] text-white rounded-full flex gap-2">
                H1: {tapes[0]?.head || 0}
             </div>
          </div>

          <div className="flex justify-between px-10 py-4">
            {[
              { label: 'STEPS', val: stats.steps },
              { label: 'WRITES', val: stats.writes },
              { label: 'CELLS USED', val: stats.cellsUsed },
              { label: 'HISTORY', val: stats.historyCount },
              { label: 'TOTAL RUNS', val: stats.runs }
            ].map(s => (
               <div key={s.label} className="flex flex-col items-center">
                 <span className="text-2xl font-bold text-white mb-1">{s.val}</span>
                 <span className="text-[10px] tracking-widest text-[#888] font-mono">{s.label}</span>
               </div>
            ))}
          </div>

          <div className="border border-[#333] bg-[#222] rounded-xl overflow-hidden p-6 relative">
            <span className="absolute top-4 left-4 text-[10px] tracking-widest font-mono text-[#888]">TAPE</span>
            <div className="mt-6 flex flex-col gap-8">
              {tapes.map((t, i) => (
                <TapeView key={i} index={i} tape={t} numTapes={machineDef.tapes} />
              ))}
            </div>

            {/* Time Travel Scrubber */}
            <div className="w-full mt-6 flex items-center px-4">
              <input 
                type="range"
                min="0"
                max={Math.max(0, history.length - 1)}
                value={currentStepIndex}
                onChange={(e) => setScrubberIndex(Number(e.target.value))}
                className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#9874e8]"
              />
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={step} disabled={status === 'running'} className="flex items-center gap-2 bg-[#1c1c1c] border border-[#444] hover:bg-[#333] px-6 py-2 rounded-lg text-sm font-bold text-white transition disabled:opacity-50">
                <StepForward className="w-4 h-4"/> Step
              </button>
              <button onClick={() => status === 'running' ? pause() : run()} className="flex items-center gap-2 bg-[#1c1c1c] border border-[#444] hover:bg-[#333] px-6 py-2 rounded-lg text-sm font-bold text-white transition disabled:opacity-50">
                {status === 'running' ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>} {status === 'running' ? 'Pause' : 'Run'}
              </button>
              <button onClick={fastForward} disabled={status === 'running'} className="flex items-center gap-2 bg-[#1c1c1c] border border-[#444] hover:bg-[#333] px-6 py-2 rounded-lg text-sm font-bold text-white transition disabled:opacity-50">
                <FastForward className="w-4 h-4"/> Fast-forward
              </button>
              <button onClick={() => reset()} className="flex items-center gap-2 bg-[#1c1c1c] border border-[#444] hover:bg-[#333] px-6 py-2 rounded-lg text-sm font-bold text-white transition">
                <RotateCcw className="w-4 h-4"/> Reset
              </button>
              <div className="flex items-center gap-3 ml-4 bg-[#1c1c1c] px-4 py-2 border border-[#333] rounded-lg">
                <span className="text-xs text-[#888]">speed</span>
                <input type="range" min="50" max="1000" step="50" value={1050 - speed} onChange={(e) => setSpeed(1050 - parseInt(e.target.value))} className="w-24 accent-[#555]"/>
                <span className="text-xs text-[#888] w-10 text-right">{speed}ms</span>
              </div>
            </div>
          </div>

          <DataPanel 
            machineDef={machineDef} 
            activeState={state} 
            logs={logs} 
            history={history}
            currentStepIndex={currentStepIndex}
            onSelectMachine={setMachineDef}
          />
        </div>
      </div>
    </div>
  );
}
