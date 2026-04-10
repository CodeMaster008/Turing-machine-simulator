import React, { useState } from 'react';

export default function BuildTMTab({ onLoadMachine }) {
  const [json, setJson] = useState('{\n  "id": "custom",\n  "name": "Custom TM",\n  "tapes": 1,\n  "startState": "q0",\n  "acceptState": "qA",\n  "rejectState": "qR",\n  "initialInput": "110",\n  "transitions": []\n}');
  const [error, setError] = useState(null);

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.id) parsed.id = 'custom';
      onLoadMachine(parsed);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-[#222] border border-[#333] rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
      <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-6 w-full text-left">
        Custom TM Builder
      </h3>
      
      <div className="w-full flex-grow flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-[#1c1c1c] border border-[#333] rounded-xl p-4 flex flex-col">
          <label className="text-[#a0a0a0] text-xs font-mono mb-2 uppercase tracking-widest">Definitions JSON</label>
          <textarea 
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="flex-grow bg-[#111] border border-[#333] rounded-lg p-4 font-mono text-sm text-[#9874e8] focus:outline-none focus:border-[#555] min-h-[300px]"
            spellCheck="false"
          />
        </div>
        
        <div className="lg:w-1/3 flex flex-col justify-center items-center p-8 bg-[#1c1c1c] border border-[#333] rounded-xl border-dashed">
           <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mb-4">
             <span className="text-2xl">⚙️</span>
           </div>
           <h4 className="text-white font-bold mb-2">Build Engine</h4>
           <p className="text-[#888] text-sm text-center mb-2">
             Inject a custom Transition schema directly into the Simulator Engine.
           </p>
           {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
           <button onClick={handleLoad} className="bg-[#9874e8] hover:bg-[#7e60bf] text-white px-8 py-3 rounded-lg font-bold transition shadow-lg w-full">
             Compile & Load
           </button>
        </div>
      </div>
    </div>
  );
}
