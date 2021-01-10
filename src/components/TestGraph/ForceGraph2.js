// ForceGraph.js
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import './ForceGraph.css'


function ForceGraph2({ width, height, graph }) {
    const ref = useRef();

    // useEffect(() => {
    //     const svg = d3.select(ref.current)
    //         .attr("width", width)
    //         .attr("height", height)
    //         .style("border", "1px solid black")
    // }, []);

    useEffect(() => {
        draw();
    }, [graph]);

    const draw = () => {

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black");

        var gnodes = svg.selectAll('g.gnode')
            .data(graph.nodes)
            .enter()
            .append('g')
            .classed('node', true);

        // Add one circle in each group
        var node = gnodes.append("circle")
            .attr("class", "node")
            .attr("r", 10);

        // Append the labels to each group
        var labels = gnodes.append("text")
            .text(function (d) { return d.name; });


        const link = gnodes.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(graph.links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));


        const simulation = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink(graph.links))
            .on("tick", tick);

        function tick() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
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

export default ForceGraph2;