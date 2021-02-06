// ForceGraph.js
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import './ForceGraph.css'

function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
};

function ForceGraph3({ width, height, graph }) {
    const ref = useRef();

    useEffect(() => {
        draw();
    }, [graph]);

    const draw = () => {

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black");

        const node = svg.append("g")
            .selectAll("g")
            .data(graph.nodes)
            .join("g")
            .classed("node", true);

        const tooltip = svg.append("g")
            .selectAll('.tooltip-area')
            .style('opacity', 0)
            .join(".tooltip-area");

        const mouseover = (event, d) => {
            tooltip.style("opacity", 1);

            console.log(d)

            const [x, y] = d3.pointer(event);

            tooltip
                .attr('transform', `translate(${x}, ${y})`);
        };

        const mouseleave = (event, d) => {
            tooltip.style('opacity', 0);
        }

        const mousemove = (event, d) => {
            tooltip.style("opacity", 1);
            const text = d3.select('.tooltip-area__text');
            text.text(`Person Name: ${d.name}; id: ${d.id}`);
            const [x, y] = d3.pointer(event);

            tooltip
                .attr('transform', `translate(${x}, ${y})`);
        };

        // Add one circle in each group
        node.append("circle")
            .attr("class", "node")
            .attr("r", 8)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("mouseover", mouseover);

        node.append("text")
            .attr("x", 6)
            .attr("y", "0.31em")
            .text(d => d.id)

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(graph.links)
            .join("line")
            //.attr("stroke-width", d => Math.sqrt(d.value)
            .attr("stroke-width", 1.5);

        function linkArc(d) {
            const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
            console.log("in the arc function");
            return `
                  M${d.source.x},${d.source.y}
                  A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
                `;

        }

        const simulation = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink(graph.links))
            .on("tick", tick);

        const drag = d3
            .drag()
            .on("start", dragstart)
            .on("drag", dragged);

        node.call(drag).on("click", click);

        function tick() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .attr("d", linkArc);
            node
                .attr("transform", d => `translate(${d.x},${d.y})`);

            tooltip
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        }

        function click(event, d) {
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            simulation.alpha(1).restart();
        }

        function dragstart() {
            d3.select(this).classed("fixed", true);
        }

        function dragged(event, d) {
            d.fx = clamp(event.x, 0, width);
            d.fy = clamp(event.y, 0, height);
            simulation.alpha(1).restart();
        }


    };

    return (
        <div className="graph">
            <svg ref={ref}>
                <g className="tooltip-area">
                    <text className="tooltip-area__text"></text>
                </g>
            </svg>
        </div>
    );
};

export default ForceGraph3;