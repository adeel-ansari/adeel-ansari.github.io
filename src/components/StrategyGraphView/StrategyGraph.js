import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import { buildGraph, GROUP_COLORS, GROUP_ORDER } from '../../ontology';
import './StrategyGraph.css';

const WIDTH = 1000;
const HEIGHT = 820;
const RADIUS = 9;

const bandY = (group) => 50 + (GROUP_ORDER.indexOf(group) * (HEIGHT - 100)) / (GROUP_ORDER.length - 1);

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

function StrategyGraph() {
    const ref = useRef();

    useEffect(() => {
       const graph = buildGraph();
       const svg = d3.select(ref.current);
       svg.selectAll('*').remove();
       svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
           .attr('preserveAspectRatio', 'xMidYMid meet')
           .attr('class', 'svg');

       svg.append('defs').append('marker')
           .attr('id', 'arrow')
           .attr('viewBox', '0 -5 10 10')
           .attr('refX', 10)
           .attr('refY', 0)
           .attr('markerWidth', 6)
           .attr('markerHeight', 6)
           .attr('orient', 'auto')
           .append('path')
           .attr('d', 'M0,-5L10,0L0,5')
           .attr('class', 'arrow-head');

       const link = svg.append('g')
           .selectAll('g')
            .data(graph.links)
           .join('g')
           .attr('class', (d) => `link ${d.kind}`);

       const line = link.append('line')
           .attr('class', 'link-line')
           .attr('marker-end', 'url(#arrow)');
       line.append('title').text((d) => `${d.source} → ${d.link_label} → ${d.target}`);

       const linkText = link.append('text')
           .attr('class', 'link-label')
           .attr('dy', '-0.3em')
           .attr('text-anchor', 'middle')
           .text((d) => d.link_label);

       const node = svg.append('g')
           .selectAll('g')
            .data(graph.nodes)
           .join('g')
           .attr('class', 'node');

       node.append('circle')
           .attr('r', RADIUS)
           .attr('fill', (d) => GROUP_COLORS[d.group]);

       node.append('text')
           .attr('class', 'node-text')
           .attr('x', RADIUS + 4)
           .attr('dy', '0.35em')
           .text((d) => d.label);

       node.append('title').text((d) => `${d.label} (${d.group})`);

       // Legend
       const legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(12, 16)');
       GROUP_ORDER.forEach((group, i) => {
           const row = legend.append('g').attr('transform', `translate(0, ${i * 18})`);
           row.append('circle').attr('r', 6).attr('cx', 6).attr('fill', GROUP_COLORS[group]);
           row.append('text').attr('x', 18).attr('dy', '0.35em').text(group);
       });

       const simulation = d3.forceSimulation(graph.nodes)
           .force('link', d3.forceLink(graph.links).id((d) => d.id).distance(110).strength(0.25))
           .force('charge', d3.forceManyBody().strength(-500))
           .force('center', d3.forceCenter(WIDTH / 2 + 60, HEIGHT / 2))
           .force('collide', d3.forceCollide().radius(42))
           // Pull each group toward its own horizontal band so the graph
           // reads top to bottom in cascade order.
           .force('y', d3.forceY((d) => bandY(d.group)).strength(0.35))
           .force('x', d3.forceX(WIDTH / 2 + 60).strength(0.03))
           .on('tick', () => {
               graph.nodes.forEach((d) => {
                   d.x = clamp(d.x, RADIUS + 140, WIDTH - 200);
                   d.y = clamp(d.y, RADIUS + 10, HEIGHT - RADIUS - 10);
                });
               line.each(function draw(d) {
                   const dx = d.target.x - d.source.x;
                   const dy = d.target.y - d.source.y;
                   const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                   d3.select(this)
                       .attr('x1', d.source.x)
                       .attr('y1', d.source.y)
                       .attr('x2', d.target.x - (dx / dist) * (RADIUS + 2))
                       .attr('y2', d.target.y - (dy / dist) * (RADIUS + 2));
               });
               linkText.attr('transform', (d) => {
                   const x = (d.source.x + d.target.x) / 2;
                   const y = (d.source.y + d.target.y) / 2;
                   let angle = (Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180) / Math.PI;
                   if (angle > 90 || angle < -90) angle += 180;
                   return `translate(${x},${y}) rotate(${angle})`;
               });
               node.attr('transform', (d) => `translate(${d.x},${d.y})`);
           });

       node.call(d3.drag()
           .on('start', (event, d) => {
               if (!event.active) simulation.alphaTarget(0.3).restart();
               d.fx = d.x;
               d.fy = d.y;
           })
           .on('drag', (event, d) => {
               d.fx = clamp(event.x, 0, WIDTH);
               d.fy = clamp(event.y, 0, HEIGHT);
           })
           .on('end', (event) => {
               if (!event.active) simulation.alphaTarget(0);
           }));

       // Double-click a node to release it after dragging.
       node.on('dblclick', (event, d) => {
           d.fx = null;
           d.fy = null;
           simulation.alpha(0.5).restart();
       });

       return () => simulation.stop();
   }, []);

    return (
        <div className="graph">
           <p className="text-muted">
               Each circle is a class and each arrow an object property (dashed arrows are subclass links).
               Drag a class to rearrange the graph; double-click it to release it.
           </p>
           <svg ref={ref} />
        </div>
    );
}

export default StrategyGraph;
