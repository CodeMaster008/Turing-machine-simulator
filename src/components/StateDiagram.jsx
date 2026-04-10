import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function StateDiagram({ machineDef, activeState }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !machineDef) return;

    const width = 600;
    const height = 400;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto")
      .attr('class', 'dark:bg-slate-800 rounded-lg');

    // Extract nodes and links
    const states = new Set();
    states.add(machineDef.startState);
    states.add(machineDef.acceptState);
    states.add(machineDef.rejectState);

    machineDef.transitions.forEach(t => {
      states.add(t.state);
      states.add(t.toState);
    });

    const nodes = Array.from(states).map(id => {
      let group = 'other';
      if (id === machineDef.startState) group = 'start';
      if (id === machineDef.acceptState) group = 'accept';
      if (id === machineDef.rejectState) group = 'reject';
      return { id, group };
    });

    const links = machineDef.transitions.map(t => ({
      source: t.state,
      target: t.toState,
      label: Array.isArray(t.read) ? t.read.join(',') : t.read
    }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5");

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const nodeColors = {
      start: '#3b82f6', // blue
      accept: '#22c55e', // green
      reject: '#ef4444', // red
      other: '#a855f7' // purple
    };

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", d => nodeColors[d.group])
      .attr("stroke", d => d.id === activeState ? "#ffffff" : "#000000")
      .attr("stroke-width", d => d.id === activeState ? 4 : 1);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-family", "monospace");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x = Math.max(20, Math.min(width - 20, d.x)))
        .attr("cy", d => d.y = Math.max(20, Math.min(height - 20, d.y)));

      labels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

  }, [machineDef, activeState]);

  return (
    <div className="w-full flex justify-center py-4 bg-slate-50 dark:bg-slate-800">
      <svg ref={svgRef} className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg"></svg>
    </div>
  );
}
