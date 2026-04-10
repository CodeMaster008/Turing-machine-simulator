import React from 'react';
import { BLANK } from '../../examples';

export default function IDChainTab({ history, currentStepIndex }) {
  const activeHistory = history.slice(0, currentStepIndex + 1);

  const getIDString = (h) => {
    // Only construct ID for single-tape machines or tape 0
    const tape = h.tapes[0];
    if (!tape) return '';
    
    let str = '';
    // Determine bounds tightly around content and head
    let start = Math.min(tape.minIndex, tape.head);
    let end = Math.max(tape.maxIndex, tape.head);
    
    // Trim external blanks for standard ID notation
    while (start < tape.head && (tape.cells[start] === BLANK || tape.cells[start] === undefined)) start++;
    while (end > tape.head && (tape.cells[end] === BLANK || tape.cells[end] === undefined)) end--;

    for (let i = start; i <= end; i++) {
      if (i === tape.head) {
        str += `⟨${h.state}⟩`;
      }
      str += (tape.cells[i] || BLANK);
    }
    
    return str;
  };

  return (
    <div className="bg-[#222] border border-[#333] rounded-xl p-6">
      <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-4">
        Formal Instantaneous Description (ID) Chain
      </h3>
      <div className="font-mono text-sm leading-8 text-[#a0a0a0] bg-[#1c1c1c] p-6 rounded-lg border border-[#333] max-h-96 overflow-y-auto">
        {activeHistory.length === 0 && <span className="italic text-[#555]">No data</span>}
        {activeHistory.map((h, i) => {
          const isLast = i === activeHistory.length - 1;
          const isAccept = h.status === 'accepted';
          const isReject = h.status === 'rejected';
          let styleClass = '';
          if (isLast && isAccept) styleClass = 'text-green-500 font-bold';
          if (isLast && isReject) styleClass = 'text-red-500 font-bold';

          return (
            <span key={i} className={styleClass}>
              {getIDString(h)}
              {!isLast && <span className="text-[#555] mx-2">⊢</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
