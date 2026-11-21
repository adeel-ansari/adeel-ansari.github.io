import * as d3 from 'd3';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import './OntologyGraph.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_RX = 62;   // ellipse half-width
const NODE_RY = 22;   // ellipse half-height
const ARROW_SIZE = 8; // marker size

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Split a label into at most 2 lines for display inside the ellipse. */
function wrapLabel(text) {
    if (text.length <= 13) return [text];
    const half = Math.floor(text.length / 2);
    // prefer a space near the middle
    let idx = text.lastIndexOf(' ', half + 4);
    if (idx <= 0) idx = text.indexOf(' ', half - 4);
    if (idx <= 0) return [text.slice(0, 13), text.slice(13)];
    return [text.slice(0, idx), text.slice(idx + 1)];
}

/** Distance from centre to edge of ellipse at a given angle. */
function ellipseBorder(angle, rx, ry) {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return (rx * ry) / Math.sqrt(ry * ry * cosA * cosA + rx * rx * sinA * sinA);
}

// ── Side panel ────────────────────────────────────────────────────────────────

function NodePanel({ id, ontologyModule, onClose }) {
    const { classById, propertiesFor, labelFor, GROUP_COLORS } = ontologyModule;
    const cls = classById[id];
    if (!cls) return null;

    const objProps = propertiesFor(id).filter((p) => p.kind === 'object');
    const dtProps  = propertiesFor(id).filter((p) => p.kind === 'datatype');
    const color    = GROUP_COLORS[cls.group];

    return (
        <aside className="vowl-panel">
            <button className="vowl-panel-close" onClick={onClose} aria-label="Close">×</button>
            <div className="vowl-panel-badge" style={{ background: color }}>{cls.group}</div>
            <h3 className="vowl-panel-title">{cls.label}</h3>
            {cls.subClassOf && (
                <p className="vowl-panel-sub">
                    Subclass of <strong>{labelFor(cls.subClassOf)}</strong>
                </p>
            )}
            <p className="vowl-panel-desc">{cls.description}</p>

            {objProps.length > 0 && (
                <section className="vowl-panel-section">
                    <h4>Object Properties</h4>
                    {objProps.map((p) => (
                        <div key={p.id} className="vowl-panel-prop">
                            <span className="vowl-prop-name">{p.id.split('.')[1] ?? p.id}</span>
                            <span className="vowl-prop-arrow">→</span>
                            <span className="vowl-prop-range">{labelFor(p.range)}</span>
                        </div>
                    ))}
                </section>
            )}

            {dtProps.length > 0 && (
                <section className="vowl-panel-section">
                    <h4>Datatype Properties</h4>
                    {dtProps.map((p) => (
                        <div key={p.id} className="vowl-panel-prop">
                            <span className="vowl-prop-name">{p.id.split('.')[1] ?? p.id}</span>
                            <span className="vowl-prop-arrow">:</span>
                            <span className="vowl-prop-range">{p.range}</span>
                        </div>
                    ))}
                </section>
            )}
        </aside>
    );
}

// ── Main graph ────────────────────────────────────────────────────────────────

function OntologyGraph({ ontologyModule }) {
    const { GROUP_COLORS, GROUP_ORDER, LAYOUT, buildGraph } = ontologyModule;
    const svgRef      = useRef();
    const zoomRef     = useRef();   // stores d3 zoom behaviour
    const simRef      = useRef();
    const [selectedId, setSelectedId] = useState(null);

    const fitView = useCallback(() => {
        if (!zoomRef.current || !svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const W = svgRef.current.clientWidth  || 900;
        const H = svgRef.current.clientHeight || 650;
        // reset to identity so bounding box is in world coords
        const nodes = svg.selectAll('.vowl-node').data();
        if (!nodes.length) return;
        const xs = nodes.map((d) => d.x);
        const ys = nodes.map((d) => d.y);
        const pad = 80;
        const x0 = Math.min(...xs) - NODE_RX - pad;
        const x1 = Math.max(...xs) + NODE_RX + pad;
        const y0 = Math.min(...ys) - NODE_RY - pad;
        const y1 = Math.max(...ys) + NODE_RY + pad;
        const scale = Math.min(W / (x1 - x0), H / (y1 - y0), 1.4) * 0.95;
        const tx = W / 2 - scale * (x0 + x1) / 2;
        const ty = H / 2 - scale * (y0 + y1) / 2;
        svg.transition().duration(600)
            .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }, []);

    useEffect(() => {
        const svgEl = svgRef.current;
        const W = svgEl.clientWidth  || 900;
        const H = svgEl.clientHeight || 650;

        const { nodes, links } = buildGraph();

        // ── Initial positions ──────────────────────────────────────────────
        const cascLen  = LAYOUT.cascadeGroups.length;
        const targetX  = (g) => LAYOUT.supportingGroups.includes(g) ? W * 0.84 : W * 0.44;
        const targetY  = (g) => {
            if (LAYOUT.supportingGroups.includes(g)) return H / 2;
            const i = LAYOUT.cascadeGroups.indexOf(g);
            if (i < 0) return H / 2;
            return 60 + i * (H - 100) / Math.max(cascLen - 1, 1);
        };

        const byGroup = {};
        nodes.forEach((n) => { (byGroup[n.group] = byGroup[n.group] ?? []).push(n); });
        Object.entries(byGroup).forEach(([group, gnodes]) => {
            const isSupport = LAYOUT.supportingGroups.includes(group);
            gnodes.forEach((n, i) => {
                const spread = Math.min(400, gnodes.length * 130);
                n.x = targetX(group) + (isSupport ? 0 : (gnodes.length > 1 ? (i / (gnodes.length - 1) - 0.5) * spread : 0));
                n.y = targetY(group) + (isSupport ? (gnodes.length > 1 ? (i / (gnodes.length - 1) - 0.5) * (H * 0.7) : 0) : 0);
            });
        });

        // ── SVG setup ─────────────────────────────────────────────────────
        const svg = d3.select(svgEl);
        svg.selectAll('*').remove();
        svg.attr('class', 'vowl-svg');

        const zoomGroup = svg.append('g').attr('class', 'vowl-zoom');

        // Arrow markers
        const defs = svg.append('defs');
        const makeArrow = (id, color) =>
            defs.append('marker')
                .attr('id', id)
                .attr('viewBox', `0 ${-ARROW_SIZE / 2} ${ARROW_SIZE} ${ARROW_SIZE}`)
                .attr('refX', 0).attr('refY', 0)
                .attr('markerWidth', ARROW_SIZE).attr('markerHeight', ARROW_SIZE)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', `M0,${-ARROW_SIZE / 2}L${ARROW_SIZE},0L0,${ARROW_SIZE / 2}`)
                .attr('fill', color);
        makeArrow('arr-prop',    '#b09980');
        makeArrow('arr-sub',     '#cfc0b0');
        makeArrow('arr-prop-hi', '#c07a3d');
        makeArrow('arr-sub-hi',  '#c07a3d');

        // ── Edges ─────────────────────────────────────────────────────────
        const linkG  = zoomGroup.append('g').attr('class', 'vowl-links');
        const linkEl = linkG.selectAll('g')
            .data(links).join('g')
            .attr('class', (d) => `vowl-link vowl-link--${d.kind}`);

        // path element
        const linkPath = linkEl.append('path').attr('class', 'vowl-link-path');

        // label
        const linkLabel = linkEl.filter((d) => d.link_label)
            .append('text').attr('class', 'vowl-link-label').attr('text-anchor', 'middle')
            .text((d) => d.link_label);

        // ── Nodes ─────────────────────────────────────────────────────────
        const nodeG  = zoomGroup.append('g').attr('class', 'vowl-nodes');
        const nodeEl = nodeG.selectAll('g')
            .data(nodes).join('g')
            .attr('class', 'vowl-node')
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        nodeEl.append('ellipse')
            .attr('rx', NODE_RX).attr('ry', NODE_RY)
            .attr('fill', (d) => GROUP_COLORS[d.group])
            .attr('class', 'vowl-node-shape');

        nodeEl.append('text')
            .attr('class', 'vowl-node-label')
            .attr('text-anchor', 'middle')
            .each(function (d) {
                const sel   = d3.select(this);
                const lines = wrapLabel(d.label);
                if (lines.length === 1) {
                    sel.append('tspan').attr('dy', '0.35em').text(lines[0]);
                } else {
                    sel.append('tspan').attr('x', 0).attr('dy', '-0.45em').text(lines[0]);
                    sel.append('tspan').attr('x', 0).attr('dy', '1.1em').text(lines[1]);
                }
            });

        nodeEl.append('title').text((d) => `${d.label} (${d.group})`);

        // ── Simulation ────────────────────────────────────────────────────
        const sim = d3.forceSimulation(nodes)
            .force('link',    d3.forceLink(links).id((d) => d.id).distance(140).strength(0.25))
            .force('charge',  d3.forceManyBody().strength(-700))
            .force('collide', d3.forceCollide().radius(NODE_RX + 30))
            .force('y',       d3.forceY((d) => targetY(d.group)).strength(0.75))
            .force('x',       d3.forceX((d) => targetX(d.group)).strength(
                (d) => LAYOUT.supportingGroups.includes(d.group) ? 0.6 : 0.07,
            ))
            .alphaDecay(0.025)
            .on('tick', tick)
            .on('end',  () => setTimeout(fitView, 50));

        simRef.current = sim;

        function tick() {
            // Update edges
            linkEl.each(function (d) {
                const sx = d.source.x, sy = d.source.y;
                const tx = d.target.x, ty = d.target.y;
                if (!Number.isFinite(sx + sy + tx + ty)) return;

                const angle   = Math.atan2(ty - sy, tx - sx);
                const srcR    = ellipseBorder(angle, NODE_RX, NODE_RY);
                const tgtR    = ellipseBorder(angle + Math.PI, NODE_RX, NODE_RY);

                // Start/end on ellipse boundaries
                const x1 = sx + Math.cos(angle)        * srcR;
                const y1 = sy + Math.sin(angle)        * srcR;
                // End offset by arrowhead size so the tip lands exactly at target edge
                const x2 = tx + Math.cos(angle + Math.PI) * (tgtR + ARROW_SIZE + 1);
                const y2 = ty + Math.sin(angle + Math.PI) * (tgtR + ARROW_SIZE + 1);

                // Slight perpendicular curve
                const mx  = (x1 + x2) / 2 - (y2 - y1) * 0.1;
                const my  = (y1 + y2) / 2 + (x2 - x1) * 0.1;

                // Assign arrow marker
                const isHighlight = d.source.id === selectedId || d.target.id === selectedId;
                const marker = d.kind === 'subclass'
                    ? (isHighlight ? 'url(#arr-sub-hi)' : 'url(#arr-sub)')
                    : (isHighlight ? 'url(#arr-prop-hi)' : 'url(#arr-prop)');

                d3.select(this).select('path')
                    .attr('d', `M${x1},${y1} Q${mx},${my} ${x2},${y2}`)
                    .attr('marker-end', marker);

                // Label at bezier midpoint
                const lx = 0.25 * x1 + 0.5 * mx + 0.25 * x2;
                const ly = 0.25 * y1 + 0.5 * my + 0.25 * y2;
                let   la = angle * 180 / Math.PI;
                if (la > 90 || la < -90) la += 180;

                d3.select(this).select('text')
                    .attr('transform', `translate(${lx},${ly}) rotate(${la})`);
            });

            nodeEl.attr('transform', (d) => `translate(${d.x},${d.y})`);
        }

        // ── Drag ──────────────────────────────────────────────────────────
        nodeEl.call(d3.drag()
            .on('start', (event, d) => {
                event.sourceEvent.stopPropagation();
                if (!event.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
            .on('end',  (event, d) => {
                if (!event.active) sim.alphaTarget(0);
                d.fx = null; d.fy = null;
            }));

        nodeEl.on('dblclick', (event, d) => {
            event.stopPropagation();
            d.fx = null; d.fy = null;
            sim.alpha(0.5).restart();
        });

        // ── Click to select ───────────────────────────────────────────────
        nodeEl.on('click', (event, d) => {
            event.stopPropagation();
            setSelectedId((prev) => (prev === d.id ? null : d.id));
        });
        svg.on('click', () => setSelectedId(null));

        // ── Zoom / pan ────────────────────────────────────────────────────
        const zoom = d3.zoom()
            .scaleExtent([0.2, 4])
            .filter((event) => {
                // Allow wheel zoom; allow drag only on the SVG background, not on nodes
                if (event.type === 'wheel') return true;
                return !event.target.closest('.vowl-node');
            })
            .on('zoom', (event) => zoomGroup.attr('transform', event.transform));

        svg.call(zoom);
        zoomRef.current = zoom;

        // Start slightly zoomed out
        svg.call(zoom.transform, d3.zoomIdentity.translate(W * 0.05, H * 0.05).scale(0.75));

        return () => sim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update selected highlight without re-running simulation
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('.vowl-node')
            .classed('vowl-node--selected', (d) => d && d.id === selectedId)
            .classed('vowl-node--dim',      (d) => d && !!selectedId && d.id !== selectedId);
        svg.selectAll('.vowl-link')
            .classed('vowl-link--hi', (d) =>
                d && (d.source.id === selectedId || d.target.id === selectedId));
        // force tick to refresh arrow colours
        if (simRef.current) simRef.current.alpha(0.001).restart();
    }, [selectedId]);

    return (
        <div className="vowl-wrap">
            <svg ref={svgRef} className="vowl-svg" />

            {/* Controls overlay */}
            <div className="vowl-controls">
                <button className="vowl-btn" onClick={fitView} title="Fit all nodes in view">
                    ⊡ Fit
                </button>
                <button
                    className="vowl-btn"
                    onClick={() => d3.select(svgRef.current)
                        .transition().duration(400)
                        .call(zoomRef.current.transform, d3.zoomIdentity)}
                    title="Reset zoom"
                >
                    1:1
                </button>
                <span className="vowl-hint">
                    Scroll to zoom · drag canvas to pan · click node for details · double-click to unpin
                </span>
            </div>

            {/* Legend overlay */}
            <div className="vowl-legend">
                {GROUP_ORDER.map((g) => (
                    <div key={g} className="vowl-legend-row">
                        <span className="vowl-legend-dot" style={{ background: GROUP_COLORS[g] }} />
                        <span className="vowl-legend-name">{g}</span>
                    </div>
                ))}
                <div className="vowl-legend-row vowl-legend-edge">
                    <span className="vowl-legend-line vowl-legend-line--solid" />
                    <span className="vowl-legend-name">property</span>
                </div>
                <div className="vowl-legend-row vowl-legend-edge">
                    <span className="vowl-legend-line vowl-legend-line--dashed" />
                    <span className="vowl-legend-name">subclass</span>
                </div>
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
