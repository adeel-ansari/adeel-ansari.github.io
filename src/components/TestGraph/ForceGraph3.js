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

        // define objects
        // not defined in the functions because otherwise it will
        // append a new link/node each time it moves
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black");

        const node = svg.append("g")
            .selectAll("g")
            .data(graph.nodes)
            .join("g")
            .classed("node", true);

        // Add one circle in each group
        node.append("circle")
            .attr("class", "node")
            .attr("r", 8);

        node.append("text")
            .attr("x", 6)
            .attr("y", "0.31em")
            .text(d => d.name)

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(graph.links)
            .join("line")
            //.attr("stroke-width", d => Math.sqrt(d.value)
            .attr("stroke-width", 1);

        const simulation = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink().links(graph.links).id(d=>d.name))
            .on("tick", tick);

            
        function updateLinks() {

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .exit().remove()
        }

        function updateNodes() {

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        }

        const drag = d3
            .drag()
            .on("start", dragstart)
            .on("drag", dragged);

        node.call(drag).on("click", click);

        function tick() {
            updateLinks()
            updateNodes()
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
                {/* <g className="tooltip-area">
                    <text className="tooltip-area__text"></text>
                </g> */}
            </svg>
        </div>
    );
};

export default ForceGraph3;