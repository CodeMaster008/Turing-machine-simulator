import React from 'react';
import StateDiagram from '../StateDiagram';

export default function ExecutionTab({ machineDef, activeState, logs }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transition Table */}
        <div className="bg-[#222] border border-[#333] rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-4">
            Transition Function δ — active row highlighted
          </h3>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-sm text-left border-collapse font-mono">
              <thead className="text-xs text-[#888] uppercase bg-[#1c1c1c] sticky top-0">
                <tr>
                  <th className="px-4 py-2 border-b border-[#333]">State</th>
                  <th className="px-4 py-2 border-b border-[#333]">Read</th>
                  <th className="px-4 py-2 border-b border-[#333]">→State</th>
                  <th className="px-4 py-2 border-b border-[#333]">Write</th>
                  <th className="px-4 py-2 border-b border-[#333]">Dir</th>
                </tr>
              </thead>
              <tbody>
                {machineDef.transitions.map((t, i) => {
                  const isActive = t.state === activeState;
                  return (
                    <tr key={i} className={`border-b border-[#2a2a2a] ${isActive ? 'bg-[#2a4365] text-white' : 'text-[#888]'}`}>
                      <td className={`px-4 py-2 ${isActive ? 'text-[#63b3ed] font-bold' : ''}`}>{t.state}</td>
                      <td className={`px-4 py-2 ${isActive ? 'text-[#f6ad55]' : ''}`}>{Array.isArray(t.read) ? t.read.join(', ') : t.read}</td>
                      <td className={`px-4 py-2 ${isActive ? 'text-[#b794f4]' : ''}`}>{t.toState}</td>
                      <td className={`px-4 py-2 ${isActive ? 'text-[#68d391]' : ''}`}>{Array.isArray(t.write) ? t.write.join(', ') : t.write}</td>
                      <td className={`px-4 py-2 ${isActive ? 'text-[#63b3ed]' : ''}`}>{Array.isArray(t.dir) ? t.dir.join(', ') : t.dir}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Execution Log */}
        <div className="bg-[#222] border border-[#333] rounded-xl p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-4">
            Execution Log
          </h3>
          <div className="font-mono text-sm flex flex-col gap-1 overflow-y-auto max-h-80 pr-2">
            {logs.length === 0 && <span className="text-[#555] italic">No execution data yet. Run the machine!</span>}
            {logs.map((log, i) => {
              const isLast = i === logs.length - 1;
              const isAccept = isLast && log.includes(machineDef.acceptState);
              const isReject = isLast && log.includes(machineDef.rejectState);
              let colorClass = 'text-[#a0a0a0]';
              if (isAccept) colorClass = 'text-green-500 font-bold';
              else if (isReject) colorClass = 'text-red-500 font-bold';

              return <div key={i} className={colorClass}>{`[${i.toString().padStart(4, '0')}] ${log}`}</div>;
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#222] border border-[#333] rounded-xl p-6">
         <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-4">
            State Diagram
         </h3>
         <StateDiagram machineDef={machineDef} activeState={activeState} />
      </div>
    </div>
  );
}
