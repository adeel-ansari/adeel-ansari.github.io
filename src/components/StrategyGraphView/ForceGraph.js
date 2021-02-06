// ForceGraph.js
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';
import './ForceGraph.css'

function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
};

function ForceGraph({ width, height, graph }) {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black")
    }, []);

    useEffect(() => {
        draw();
    }, [graph]);

    const draw = () => {

        const svg = d3.select(ref.current);

        var tooltip = svg
            .selectAll('.tooltip-area')
            .style('opacity', 0);

        const mouseover = (event, d) => {
            tooltip.style("opacity", 1);
            // const text = d3.select('tooltip-area__text');
            // text.text('Testing tooltips');

            console.log(d.name);
            console.log(event);

            // const [x, y] = d3.pointer(event);

            // tooltip
            //     .attr('transform', `translate(${x}, ${y})`);
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


        var link = svg
            .selectAll(".link")
            .data(graph.links)
            .join("line")
            .classed("link", true);

        // var node = svg
        //     .append("g")
        //     .attr("fill", "currentColor")
        //     .attr("stroke-linecap", "round")
        //     .attr("stroke-linejoin", "round")
        //     .selectAll("g")
        //     .data(graph.nodes)
        //     .join("g");
        
            // node.append("circle")
            // .attr("stroke", "white")
            // .attr("stroke-width", 1.5)
            // .attr("r", 4);
      
        //.call(drag(simulation));

        var node = svg
            .selectAll(".node")
            .data(graph.nodes)
            .join("circle")
            .attr("r", 12)  // determines the size of the node
            .classed("node", true)
            .classed("fixed", d => d.fx !== undefined)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("mouseover", mouseover);

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
                .attr("y2", d => d.target.y);
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
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
        //
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

export default ForceGraph;