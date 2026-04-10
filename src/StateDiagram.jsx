import { useMemo } from 'react';

const ARROWHEAD_ID = "arrowhead";

function getCoordinates(index, total, radius, cx, cy) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}

export default function StateDiagram({ machine, activeState }) {
  const nodes = useMemo(() => {
    const stateSet = new Set();
    stateSet.add(machine.startState);
    stateSet.add(machine.acceptState);
    stateSet.add(machine.rejectState);
    machine.transitions.forEach(t => {
      stateSet.add(t.state);
      stateSet.add(t.toState);
    });
    
    // Sort so start state is top, etc.
    return Array.from(stateSet).sort((a, b) => {
      if (a === machine.startState) return -1;
      if (b === machine.startState) return 1;
      return a.localeCompare(b);
    });
  }, [machine]);

  const cx = 250;
  const cy = 120;
  const radius = 80;

  const nodeMap = useMemo(() => {
    const map = {};
    nodes.forEach((id, i) => {
      map[id] = getCoordinates(i, nodes.length, radius, cx, cy);
    });
    return map;
  }, [nodes]);

  // Aggregate transitions between same nodes
  const edges = useMemo(() => {
    const edgeMap = {};
    machine.transitions.forEach(t => {
      const key = `${t.state}|${t.toState}`;
      if (!edgeMap[key]) {
        edgeMap[key] = { from: t.state, to: t.toState, labels: [] };
      }
      const readVal = t.read === '□' ? '□' : t.read;
      const writeVal = t.write === '□' ? '□' : t.write;
      edgeMap[key].labels.push(`${readVal}/${writeVal},${t.dir}`);
    });
    return Object.values(edgeMap);
  }, [machine]);

  return (
    <svg className="diagram-svg" viewBox="0 0 500 250">
      <defs>
        <marker id={ARROWHEAD_ID} markerWidth="10" markerHeight="7" 
        refX="25" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-muted)" />
        </marker>
        <marker id={`${ARROWHEAD_ID}-active`} markerWidth="10" markerHeight="7" 
        refX="25" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-main)" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map(edge => {
        const fromPos = nodeMap[edge.from];
        const toPos = nodeMap[edge.to];
        const isActive = activeState === edge.from || activeState === edge.to; // simplifying active edge
        const marker = isActive ? `url(#${ARROWHEAD_ID}-active)` : `url(#${ARROWHEAD_ID})`;

        let d = "";
        let textX = 0;
        let textY = 0;

        if (edge.from === edge.to) {
          // Self loop
          d = `M ${fromPos.x - 10} ${fromPos.y - 15} C ${fromPos.x - 30} ${fromPos.y - 60}, ${fromPos.x + 30} ${fromPos.y - 60}, ${fromPos.x + 10} ${fromPos.y - 15}`;
          textX = fromPos.x;
          textY = fromPos.y - 55;
        } else {
          // Straight or curved line. Curved if bidirectional. Just curve all a bit.
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const nx = -dy / dist;
          const ny = dx / dist;
          const offset = 20;
          
          const cx_edge = (fromPos.x + toPos.x) / 2 + nx * offset;
          const cy_edge = (fromPos.y + toPos.y) / 2 + ny * offset;

          d = `M ${fromPos.x} ${fromPos.y} Q ${cx_edge} ${cy_edge} ${toPos.x} ${toPos.y}`;
          textX = cx_edge;
          textY = cy_edge - 5;
        }

        const labelStr = edge.labels.join(' | ');

        return (
          <g key={`${edge.from}-${edge.to}`} className={`state-edge ${isActive ? 'active' : ''}`}>
            <path d={d} markerEnd={marker} />
            <text x={textX} y={textY} textAnchor="middle">{labelStr}</text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(id => {
        const pos = nodeMap[id];
        let typeClass = "other";
        if (id === machine.startState) typeClass = "start";
        if (id === machine.acceptState) typeClass = "accept";
        if (id === machine.rejectState) typeClass = "reject";

        return (
          <g key={id} className={`state-node ${typeClass} ${id === activeState ? 'active' : ''}`} transform={`translate(${pos.x}, ${pos.y})`}>
            <circle r="20" />
            <text>{id}</text>
          </g>
        );
      })}
    </svg>
  );
}
