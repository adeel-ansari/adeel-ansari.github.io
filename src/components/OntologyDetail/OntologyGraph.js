import * as d3 from 'd3';
import React, { useRef, useEffect, useState } from 'react';
import './OntologyGraph.css';

const WIDTH  = 1000;
const HEIGHT = 800;
const RADIUS = 10;

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

const makeTargetX = (layout) => (group) =>
    layout.supportingGroups.includes(group) ? 840 : 400;

const makeTargetY = (layout) => (group) => {
    if (layout.supportingGroups.includes(group)) return HEIGHT / 2;
    const i = layout.cascadeGroups.indexOf(group);
    if (i < 0) return HEIGHT / 2;
    return 50 + i * (HEIGHT - 80) / (layout.cascadeGroups.length - 1);
};

// ── Side panel ───────────────────────────────────────────────────────────────

function NodePanel({ id, ontologyModule, onClose }) {
    const { classById, propertiesFor, labelFor, GROUP_COLORS } = ontologyModule;
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

function OntologyGraph({ ontologyModule }) {
    const { GROUP_COLORS, GROUP_ORDER, LAYOUT, buildGraph } = ontologyModule;
    const svgRef     = useRef();
    const nodeSelRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!nodeSelRef.current) return;
        nodeSelRef.current.classed('selected-node', (d) => d.id === selectedId);
    }, [selectedId]);

    useEffect(() => {
        const targetX = makeTargetX(LAYOUT);
        const targetY = makeTargetY(LAYOUT);
        const graph   = buildGraph();

        // Pre-assign initial positions
        const byGroup = {};
        graph.nodes.forEach((n) => { (byGroup[n.group] = byGroup[n.group] ?? []).push(n); });
        Object.entries(byGroup).forEach(([group, gnodes]) => {
            const isSupporting = LAYOUT.supportingGroups.includes(group);
            gnodes.forEach((n, i) => {
                if (isSupporting) {
                    n.x = targetX(group);
                    n.y = 60 + i * (HEIGHT - 80) / Math.max(gnodes.length - 1, 1);
                } else {
                    const spread = Math.min(360, gnodes.length * 85);
                    const offset = gnodes.length > 1
                        ? (i / (gnodes.length - 1) - 0.5) * spread : 0;
                    n.x = targetX(group) + offset;
                    n.y = targetY(group);
                }
            });
        });

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('class', 'svg');

        svg.append('defs').append('marker')
            .attr('id', `arrow-${ontologyModule.default.prefix}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 10).attr('refY', 0)
            .attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M0,-5L10,0L0,5')
            .attr('class', 'arrow-head');

        const arrowUrl = `url(#arrow-${ontologyModule.default.prefix})`;

        const link = svg.append('g')
            .selectAll('g').data(graph.links).join('g')
            .attr('class', (d) => `link ${d.kind}`);

        const line = link.append('line')
            .attr('class', 'link-line')
            .attr('marker-end', arrowUrl);

        const linkText = link.append('text')
            .attr('class', 'link-label')
            .attr('dy', '-0.3em')
            .attr('text-anchor', 'middle')
            .text((d) => d.link_label);

        const node = svg.append('g')
            .selectAll('g').data(graph.nodes).join('g')
            .attr('class', 'node')
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        node.append('circle')
            .attr('r', RADIUS)
            .attr('fill', (d) => GROUP_COLORS[d.group]);

        node.append('text')
            .attr('class', 'node-text')
            .attr('x', (d) => LAYOUT.supportingGroups.includes(d.group) ? -(RADIUS + 4) : RADIUS + 4)
            .attr('dy', '0.35em')
            .attr('text-anchor', (d) => LAYOUT.supportingGroups.includes(d.group) ? 'end' : 'start')
            .text((d) => d.label);

        node.append('title').text((d) => `${d.label} (${d.group})`);

        nodeSelRef.current = node;

        // Legend
        const legend = svg.append('g').attr('class', 'legend').attr('transform', 'translate(12, 16)');
        GROUP_ORDER.forEach((group, i) => {
            const row = legend.append('g').attr('transform', `translate(0, ${i * 18})`);
            row.append('circle').attr('r', 6).attr('cx', 6).attr('fill', GROUP_COLORS[group]);
            row.append('text').attr('x', 18).attr('dy', '0.35em').text(group);
        });

        const simulation = d3.forceSimulation(graph.nodes)
            .force('link',    d3.forceLink(graph.links).id((d) => d.id).distance(90).strength(0.15))
            .force('charge',  d3.forceManyBody().strength(-450))
            .force('collide', d3.forceCollide().radius(RADIUS + 28))
            .force('y', d3.forceY((d) => targetY(d.group)).strength(0.85))
            .force('x', d3.forceX((d) => targetX(d.group)).strength((d) =>
                LAYOUT.supportingGroups.includes(d.group) ? 0.75 : 0.08))
            .on('tick', () => {
                graph.nodes.forEach((d) => {
                    if (LAYOUT.supportingGroups.includes(d.group)) {
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

        node.on('dblclick', (event, d) => { d.fx = null; d.fy = null; simulation.alpha(0.5).restart(); });

        node.on('click', (event, d) => {
            event.stopPropagation();
            setSelectedId((prev) => prev === d.id ? null : d.id);
        });

        svg.on('click', () => setSelectedId(null));

        return () => simulation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <NodePanel
                    id={selectedId}
                    ontologyModule={ontologyModule}
                    onClose={() => setSelectedId(null)}
                />
            )}
        </div>
    );
}

export default OntologyGraph;
