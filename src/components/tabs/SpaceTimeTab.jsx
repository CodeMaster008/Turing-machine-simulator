import React, { useEffect, useRef } from 'react';
import { BLANK } from '../../examples';

export default function SpaceTimeTab({ history, currentStepIndex }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');
    
    // We render up to the currentStepIndex
    const renderHistory = history.slice(0, currentStepIndex + 1);
    
    if (renderHistory.length === 0) return;

    // Find min and max bounds across all rendered history to scale canvas width
    let globalMin = 0;
    let globalMax = 0;
    renderHistory.forEach(h => {
      // Use tape 0 for space time diagram
      const t = h.tapes[0];
      if (t) {
        if (t.minIndex < globalMin) globalMin = t.minIndex;
        if (t.maxIndex > globalMax) globalMax = t.maxIndex;
        if (t.head < globalMin) globalMin = t.head;
        if (t.head > globalMax) globalMax = t.head;
      }
    });

    // Add padding
    globalMin -= 2;
    globalMax += 2;
    const widthCells = globalMax - globalMin + 1;
    const heightCells = renderHistory.length;

    const cellSize = Math.max(16, Math.min(40, 800 / widthCells)); // Scale cell size between 16px and 40px
    const width = widthCells * cellSize;
    const height = heightCells * cellSize;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    // Create a color map for symbols
    const colorMap = {
      [BLANK]: '#1c1c1c',
      '0': '#4299e1',
      '1': '#ed8936',
      'a': '#9f7aea',
      'b': '#ed64a6',
      'c': '#48bb78',
      'X': '#718096',
      'Y': '#a0aec0',
      'Z': '#cbd5e0'
    };

    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    renderHistory.forEach((h, stepIdx) => {
      const tape = h.tapes[0];
      if (!tape) return;

      const y = stepIdx * cellSize;

      for (let i = globalMin; i <= globalMax; i++) {
        const x = (i - globalMin) * cellSize;
        const symbol = tape.cells[i] || BLANK;
        
        ctx.fillStyle = colorMap[symbol] || '#e2e8f0';
        
        // Highlight head location
        if (i === tape.head) {
          ctx.fillStyle = '#ffffff';
        }
        
        ctx.fillRect(x, y, cellSize, cellSize);
        
        // Slight border if cell is big enough
        if (cellSize > 4) {
          ctx.strokeStyle = '#222';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    });

  }, [history, currentStepIndex]);

  return (
    <div className="bg-[#222] border border-[#333] rounded-xl p-6 overflow-hidden">
      <h3 className="font-mono text-xs uppercase tracking-widest text-[#888] mb-4">
        Space-Time Diagram
      </h3>
      <p className="text-sm text-[#a0a0a0] mb-6">
        2D projection of the tape evolution over time. Time flows downwards. Head position is highlighted in white.
      </p>
      <div className="w-full flex justify-center overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar border border-[#333] bg-[#111] p-4 rounded-lg">
        <canvas ref={canvasRef} className="pixelated" />
      </div>
    </div>
  );
}
