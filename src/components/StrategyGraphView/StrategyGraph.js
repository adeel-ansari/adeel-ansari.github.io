import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import { buildGraph, GROUP_COLORS, GROUP_ORDER, classById, propertiesFor, labelFor } from '../../ontology';
import './StrategyGraph.css';

const WIDTH   = 1000;
const HEIGHT  = 800;
const RADIUS  = 10;

// Cascade runs top-to-bottom in the left/centre column.
// Actors get their own column on the right.
const CASCADE_GROUPS = ['Strategy', 'Winning Aspiration', 'Where to Play', 'How to Win', 'Capabilities', 'Management Systems'];

const targetX = (group) => group === 'Actors' ? 840 : 400;
const targetY = (group) => {
    if (group === 'Actors') return HEIGHT / 2;
    const i = CASCADE_GROUPS.indexOf(group);
    return 50 + i * (HEIGHT - 80) / (CASCADE_GROUPS.length - 1);
};

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

// ── Side panel ───────────────────────────────────────────────────────────────

function NodePanel({ id, onClose }) {
    const cls = classById[id];
    if (!cls) return null;
    const props = propertiesFor(id);

    return (
        <aside className="node-panel">
            <button className="node-panel-close" onClick={onClose} aria-label="Close">×</button>
            <span className="node-panel-group" style={{ color: GROUP_COLORS[cls.group] }}>
                {cls.group}
            </span>
            <h3 className="node-panel-title">{cls.label}</h3>
            {cls.subClassOf && (
                <p className="node-panel-sub">
                    Subclass of <strong>{labelFor(cls.subClassOf)}</strong>
                </p>
            )}
            <p className="node-panel-desc">{cls.description}</p>

            {props.length > 0 && (
                <div className="node-panel-props">
                    <h4>Properties</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.map((p) => (
                                <tr key={p.id}>
                                    <td><code>{p.id.split('.')[1] ?? p.id}</code></td>
                                    <td>{labelFor(p.range)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </aside>
    );
}

// ── Graph ────────────────────────────────────────────────────────────────────

function StrategyGraph() {
    const svgRef      = useRef();
    const nodeSelRef  = useRef(null);   // stores the d3 node selection for highlight updates
    const [selectedId, setSelectedId] = useState(null);

    // Highlight the selected node whenever selectedId changes without re-running
    // the full simulation.
    useEffect(() => {
        if (!nodeSelRef.current) return;
        nodeSelRef.current.classed('selected-node', (d) => d.id === selectedId);
    }, [selectedId]);

    useEffect(() => {
        const graph = buildGraph();

        // ── Pre-assign initial positions so the simulation starts already organised
        const byGroup = {};
        graph.nodes.forEach((n) => {
            (byGroup[n.group] = byGroup[n.group] ?? []).push(n);
        });
        Object.entries(byGroup).forEach(([group, gnodes]) => {
            const ty = targetY(group);
            const tx = targetX(group);
            gnodes.forEach((n, i) => {
                if (group === 'Actors') {
                    n.x = tx;
                    n.y = 60 + i * (HEIGHT - 80) / Math.max(gnodes.length - 1, 1);
                } else {
                    const spread = Math.min(360, gnodes.length * 85);
                    const offset = gnodes.length > 1
                        ? (i / (gnodes.length - 1) - 0.5) * spread
                        : 0;
                    n.x = tx + offset;
                    n.y = ty;
                }
            });
        });

        // ── SVG setup
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('class', 'svg');

        svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10).attr('refY', 0)
            .attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M0,-5L10,0L0,5')
            .attr('class', 'arrow-head');

        // ── Links
        const link = svg.append('g')
            .selectAll('g').data(graph.links).join('g')
            .attr('class', (d) => `link ${d.kind}`);

        const line = link.append('line')
            .attr('class', 'link-line')
            .attr('marker-end', 'url(#arrow)');
        line.append('title').text((d) => `${d.source.id ?? d.source} → ${d.link_label} → ${d.target.id ?? d.target}`);

        const linkText = link.append('text')
            .attr('class', 'link-label')
            .attr('dy', '-0.3em')
            .attr('text-anchor', 'middle')
            .text((d) => d.link_label);

        // ── Nodes
        const node = svg.append('g')
            .selectAll('g').data(graph.nodes).join('g')
            .attr('class', 'node')
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', RADIUS)
            .attr('fill', (d) => GROUP_COLORS[d.group]);

        node.append('text')
            .attr('class', 'node-text')
            .attr('x', (d) => d.group === 'Actors' ? -(RADIUS + 4) : RADIUS + 4)
            .attr('dy', '0.35em')
            .attr('text-anchor', (d) => d.group === 'Actors' ? 'end' : 'start')
            .text((d) => d.label);

        node.append('title').text((d) => `${d.label} (${d.group})`);

        // Store selection so we can update highlight without re-running the effect
        nodeSelRef.current = node;

        // ── Legend
        const legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(12, 16)');
        GROUP_ORDER.forEach((group, i) => {
            const row = legend.append('g').attr('transform', `translate(0, ${i * 18})`);
            row.append('circle').attr('r', 6).attr('cx', 6).attr('fill', GROUP_COLORS[group]);
            row.append('text').attr('x', 18).attr('dy', '0.35em').text(group);
        });

        // ── Simulation
        const simulation = d3.forceSimulation(graph.nodes)
            .force('link',    d3.forceLink(graph.links).id((d) => d.id).distance(90).strength(0.15))
            .force('charge',  d3.forceManyBody().strength(-450))
            .force('collide', d3.forceCollide().radius(RADIUS + 28))
            // Strong y-force keeps groups in their bands
            .force('y', d3.forceY((d) => targetY(d.group)).strength(0.85))
            // Moderate x-force: Actors stay right, cascade stays centred
            .force('x', d3.forceX((d) => targetX(d.group)).strength((d) => d.group === 'Actors' ? 0.75 : 0.08))
            .on('tick', () => {
                graph.nodes.forEach((d) => {
                    if (d.group === 'Actors') {
                        d.x = clamp(d.x, 760, WIDTH - 20);
                    } else {
                        d.x = clamp(d.x, RADIUS + 140, 720);
                    }
                    d.y = clamp(d.y, RADIUS + 10, HEIGHT - RADIUS - 10);
                });
                line.each(function draw(d) {
                    const dx = d.target.x - d.source.x;
                    const dy = d.target.y - d.source.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    d3.select(this)
                        .attr('x1', d.source.x).attr('y1', d.source.y)
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

        // ── Drag
        node.call(d3.drag()
            .on('start', (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = clamp(event.x, 0, WIDTH);
                d.fy = clamp(event.y, 0, HEIGHT);
            })
            .on('end', (event) => {
                if (!event.active) simulation.alphaTarget(0);
            }));

        // Double-click releases a pinned node
        node.on('dblclick', (event, d) => {
            d.fx = null; d.fy = null;
            simulation.alpha(0.5).restart();
        });

        // Click selects a node and shows the panel
        node.on('click', (event, d) => {
            event.stopPropagation();
            setSelectedId((prev) => prev === d.id ? null : d.id);
        });

        // Click on SVG background deselects
        svg.on('click', () => setSelectedId(null));

        return () => simulation.stop();
    }, []);

    return (
        <div className={`graph-wrap${selectedId ? ' has-panel' : ''}`}>
            <div className="graph">
                <p className="graph-hint">
                    Click a node to explore its definition. Drag to rearrange; double-click to release.
                </p>
                <svg ref={svgRef} />
            </div>
            {selectedId && (
                <NodePanel id={selectedId} onClose={() => setSelectedId(null)} />
            )}
        </div>
    );
}

export default StrategyGraph;
