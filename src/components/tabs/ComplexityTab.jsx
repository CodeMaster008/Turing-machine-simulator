import React, { useState, useEffect } from 'react';
import { useTuringMachine } from '../../useTuringMachine'; // Direct hook engine utilization
import { BLANK } from '../../examples';

export default function ComplexityTab({ machineDef }) {
  const [data, setData] = useState([]);
  const [isComputing, setIsComputing] = useState(false);

  // Dynamic input generators
  const generateString = (tag, n) => {
    switch (tag) {
      case 'Unit 3+5': // anbn
        return 'a'.repeat(n) + 'b'.repeat(n);
      case 'Unit 5': // anbncn, multiplier
        if (machineDef.id === 'anbncn') return 'a'.repeat(n) + 'b'.repeat(n) + 'c'.repeat(n);
        if (machineDef.id === 'unaryMultiplier') return '1'.repeat(n) + 'c' + '1'.repeat(n);
        if (machineDef.id === 'palindrome') return 'a'.repeat(n) + 'b' + 'a'.repeat(n);
        return '1'.repeat(n); // default to 1s
      case 'Unit 5 · 2-TAPE':
        return ['1'.repeat(n), ''];
      default:
        return '1'.repeat(n);
    }
  };

  const computeComplexity = () => {
    if (machineDef.id === 'fourStateBusyBeaver') {
      setData([{n: 1, steps: 107, label: "BB(4) Constants"}]);
      return;
    }

    setIsComputing(true);
    
    // Process asynchronously to not freeze UI
    setTimeout(() => {
      const results = [];
      const testLengths = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      testLengths.forEach(n => {
        const inputStr = generateString(machineDef.cardTag, n);
        
        // Setup raw arrays logic without hooking directly into React state for speed
        // Actually, we use the raw definition
        let head = [...Array(machineDef.tapes || 1)].map(()=>0);
        let tapeCells = [...Array(machineDef.tapes || 1)].map(()=>({}));
        let state = machineDef.startState;
        
        let initialInputs = Array.isArray(inputStr) ? inputStr : [inputStr];
        for (let i = 0; i < (machineDef.tapes || 1); i++) {
           const str = initialInputs[i] || '';
           if(str.length===0) tapeCells[i][0] = BLANK;
           for(let j=0; j<str.length; j++) tapeCells[i][j] = str[j];
        }

        let steps = 0;
        let halted = false;

        while (steps < 5000 && !halted) {
          if (state === machineDef.acceptState || state === machineDef.rejectState) {
            halted = true;
            break;
          }
          
          let currentSymbols = tapeCells.map((tc, idx) => tc[head[idx]] || BLANK);
          
          let trans = null;
          for (const t of machineDef.transitions) {
            if (t.state === state) {
              let match = true;
              if (machineDef.tapes > 1) {
                for (let k = 0; k < machineDef.tapes; k++) {
                  if (t.read[k] !== currentSymbols[k]) { match = false; break; }
                }
              } else {
                if (t.read !== currentSymbols[0]) match = false;
              }
              if (match) { trans = t; break; }
            }
          }

          if (!trans) break; // Reject implicit
          
          steps++;
          for(let i=0; i < (machineDef.tapes || 1); i++) {
             const w = machineDef.tapes > 1 ? trans.write[i] : trans.write;
             if (w !== undefined) tapeCells[i][head[i]] = w;
             const d = machineDef.tapes > 1 ? trans.dir[i] : trans.dir;
             if (d === 'R') head[i]++;
             else if (d === 'L') head[i]--;
          }
          state = trans.toState;
        }

        results.push({ n, steps, label: typeof inputStr === 'string' ? inputStr : JSON.stringify(inputStr)});
      });

      setData(results);
      setIsComputing(false);
    }, 50); // slight yield
  };

  return (
    <div className="bg-[#222] border border-[#333] rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-1">
            Empirical Time Complexity Analysis
          </h3>
          <p className="text-sm text-[#a0a0a0]">
            Maps step counts vs input length <code className="text-[#9874e8]">n</code> to demonstrate polynomial bounds.
          </p>
        </div>
        <button 
          onClick={computeComplexity}
          disabled={isComputing}
          className="bg-[#2a2a2a] hover:bg-[#333] border border-[#444] px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
        >
          {isComputing ? 'Computing (n=1→9)...' : 'Compute Bounds (n=1→9)'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#1c1c1c] rounded-xl border border-[#333] p-4 flex items-end gap-2 h-64 justify-around pt-8 relative">
          {data.length === 0 && <span className="absolute self-center text-[#555] italic">Click compute to map bounds.</span>}
          {data.map((d, i) => {
            const maxSteps = Math.max(...data.map(r => r.steps), 10);
            const height = Math.max((d.steps / maxSteps) * 100, 5);
            return (
              <div key={i} className="flex flex-col items-center justify-end h-full group relative w-12">
                <div className="absolute -top-6 text-[10px] bg-[#333] border border-[#444] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 font-mono transition">
                  {d.steps}s
                </div>
                <div 
                  className="w-full bg-[#4ea8de] rounded-t-sm opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-[#888] mt-2 font-mono">n={d.n}</span>
              </div>
            )
          })}
        </div>

        <div className="w-full lg:w-1/3 bg-[#1c1c1c] rounded-xl border border-[#333] overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead className="bg-[#333] text-[#a0a0a0]">
              <tr>
                <th className="p-3">Sequence</th>
                <th className="p-3">Input</th>
                <th className="p-3 text-right">Steps O(f)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-t border-[#333] text-[#888] hover:bg-[#252525]">
                  <td className="p-3">n = {d.n}</td>
                  <td className="p-3 truncate max-w-[100px] text-[#9874e8]">{d.label}</td>
                  <td className="p-3 text-right font-bold text-white">{d.steps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
