// ForceGraph.js
import * as d3 from 'd3';
import React, { useState, useRef, useEffect } from 'react';
import './StrategyGraph.css'


// const graph = (
//     {
//         'nodes': [
//             {
//                 "id": "strategy",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "CoreCapability",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Organization",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "WhereToPlay",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "ActivitySystem",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Customer",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "WinningAspiration",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Organization",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Consumer",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "HowToWin",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Geography",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "DistributionChannel",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "ProductType",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "ConsumerSegment",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Activity",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "VerticalStageOfProduction",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "Competitor",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "ManagementSystem",
//                 "node_type": "Class"
//             },
//             {
//                 "id": "CustomerSegment",
//                 "node_type": "Class"
//             }
//         ],
//         'links': [
//             {
//                 "source": "CoreCapability",
//                 "target": "CoreCapability",
//                 "link_label": "CoreCapability.reinforcingRod"
//             },
//             {
//                 "source": "CoreCapability",
//                 "target": "CoreCapability",
//                 "link_label": "CoreCapability.reinforcingRelationship"
//             },
//             {
//                 "source": "strategy",
//                 "target": "ManagementSystem",
//                 "link_label": "Strategy.managementSystem"
//             },
//             {
//                 "source": "WinningAspiration",
//                 "target": "Competitor",
//                 "link_label": "WinningAspiration.competitorContext"
//             },
//             {
//                 "source": "Consumer",
//                 "target": "ConsumerSegment",
//                 "link_label": "Consumer.consumerSegment"
//             },
//             {
//                 "source": "Organization",
//                 "target": "ActivitySystem",
//                 "link_label": "Organization.activitySystem"
//             },
//             {
//                 "source": "strategy",
//                 "target": "WhereToPlay",
//                 "link_label": "Strategy.whereToPlay"
//             },
//             {
//                 "source": "ActivitySystem",
//                 "target": "CoreCapability",
//                 "link_label": "ActivitySystem.coreCapability"
//             },
//             {
//                 "source": "WhereToPlay",
//                 "target": "ConsumerSegment",
//                 "link_label": "WhereToPlay.consumerSegment"
//             },
//             {
//                 "source": "Organization",
//                 "target": "strategy",
//                 "link_label": "Organization.strategy"
//             },
//             {
//                 "source": "strategy",
//                 "target": "HowToWin",
//                 "link_label": "Strategy.howToWin"
//             },
//             {
//                 "source": "strategy",
//                 "target": "WinningAspiration",
//                 "link_label": "Strategy.winningAspiration"
//             },
//             {
//                 "source": "WhereToPlay",
//                 "target": "VerticalStageOfProduction",
//                 "link_label": "WhereToPlay.verticalStageOfProduction"
//             },
//             {
//                 "source": "WhereToPlay",
//                 "target": "ProductType",
//                 "link_label": "WhereToPlay.productType"
//             },
//             {
//                 "source": "WinningAspiration",
//                 "target": "ConsumerSegment",
//                 "link_label": "WinningAspiration.consumerContext"
//             },
//             {
//                 "source": "strategy",
//                 "target": "CoreCapability",
//                 "link_label": "Strategy.coreCapability"
//             },
//             {
//                 "source": "Customer",
//                 "target": "CustomerSegment",
//                 "link_label": "Customer.customerSegment"
//             },
//             {
//                 "source": "WhereToPlay",
//                 "target": "Geography",
//                 "link_label": "WhereToPlay.geography"
//             },
//             {
//                 "source": "CoreCapability",
//                 "target": "Activity",
//                 "link_label": "CoreCapability.supportingActivity"
//             },
//             {
//                 "source": "WhereToPlay",
//                 "target": "DistributionChannel",
//                 "link_label": "WhereToPlay.distributionChannel"
//             }
//         ]
//     }
// )

function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
};

function StrategyGraph({ graph }) {
    
    const ref = useRef();

    useEffect(() => {
        //setHeight(ref.current.clientHeight)
        //setHeight(800)
        //setWidth(1200)
        draw();
        //getGraphData();
    }, []);
//    }, [graph]);

    const radius = 20;
    const width = 800;
    const height = 300;

    const draw = () => {

        // clear the existing graph
        d3.select(ref.current).selectAll("*").remove();

        // define objects
        // not defined in the functions because otherwise it will
        // append a new link/node each time it moves
        const svg = d3.select(ref.current)
            //.attr("width", width)
            //.attr("height", height)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("class", "svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            //.style("border", "1px solid black")
            //.style("background-color", "rgb(240, 235, 235)")
            //.exit().remove()
            ;


        const link = svg.selectAll(".link")
            .data(graph.links)
            .enter()
                .append("g")
                .attr("class", "link")
                .append("line")
                .attr("class", "link-line")
                .style("stroke-width", 1);

        // const linkBox = svg.selectAll(".link")
        //     .append("rect")
        //     .attr("class", "link-rect")
        //     .attr("x", 30)
        //     .attr("y", 10)
        //     .attr("width", 60)
        //     .attr("height", 20);

        const linkText = svg.selectAll(".link")
            .append("text")
            .attr("class", "link-label")
            .style("font", "normal 4px Arial")
            .attr("dy", "-.3em")
            //.attr("dx", 20)
            .attr("text-anchor", "middle")
            .text((d) => {
                if (d.link_label.length > 12) {
                    return (d.link_label.substring(0,12)).concat("...")
                }
                else return d.link_label
            });

        
        // define the node circles
        const node = svg.append("g")
            .selectAll("g")
            .data(graph.nodes)
            .join("g")
            .classed("node", true);

        // Add one circle in each group
        node.append("circle")
            .filter(d => d.node_type === "Class")
            //.attr("class", "node")
            .attr("r", radius);

        // node.append("rect")
        //     .filter(d => d.node_type === "ObjectProperty")
        //     .attr("class", "objectproperty")
        //     .attr("x", -20)
        //     .attr("y", -10)
        //     .attr("width", 40)
        //     .attr("height", 20);

        // node.append("rect")
        //     .filter(d => d.node_type === "DatatypeProperty")
        //     .attr("class", "dataproperty")
        //     .attr("x", -20)
        //     .attr("y", -10)
        //     .attr("width", 40)
        //     .attr("height", 20);

        // node.append("rect")
        //     .filter(d => d.node_type === "datatype")
        //     .attr("x", -20)
        //     .attr("y", -10)
        //     .attr("class", "datatype")
        //     .attr("width", 40)
        //     .attr("height", 20);

        node.append("text")
            .attr("class", "node-text")
            .attr("x", 0)
            .attr("dy", ".35em")
            .style("font", "normal 4px Arial")
            .attr("text-anchor", "middle")
            .text((d) => {
                if (d.id.length > 8) {
                    return (d.id.substring(0,8)).concat("...")
                }
                else return d.id
            });



        const simulation = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force("link", d3.forceLink().links(graph.links).id(d => d.id).distance(50).strength(1))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force('collide', d3.forceCollide().radius(30)) // need to specify the radius as some shapes are rectangles
            .on("tick", tick);


        function updateLinks() {

            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .exit().remove();

        }
        function updateLinkLabels() {

            linkText
                .attr("x", function(d) {
                    return ((d.source.x + d.target.x)/2);

                })

                .attr("y", function(d) {
                    return ((d.source.y + d.target.y) / 2);
                })
                
                .attr("transform", function(d) {
                    var x = (d.source.x + d.target.x)/2;
                    var y = (d.source.y + d.target.y) / 2;

                    var dx = d.target.x - d.source.x;
                    var dy = d.target.y - d.source.y;

                    // angle in radians
                    var angle = Math.atan2(dy, dx);

                    // angle in degrees
                    var angle_degrees = (angle*180)/Math.PI

                    return `rotate(${angle_degrees}, ${x}, ${y})`
                });
        }

        // function updateLinkBox() {

        //     linkBox
        //         .attr("x", function(d) {
        //             return (((d.source.x + d.target.x)/2) - 30);

        //         })

        //         .attr("y", function(d) {
        //             return (((d.source.y + d.target.y) / 2) - 10);
        //         });
        // }

        function updateNodes() {

            node
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("cx", d => (
                    d.x = Math.max(radius, Math.min(width-radius, d.x))
                ))
                .attr("cy", d => (
                    d.y = Math.max(radius, Math.min(height-radius, d.y))
                ))
                .exit().remove();
        }

        const drag = d3
            .drag()
            .on("start", dragstart)
            .on("drag", dragged);

        node.call(drag).on("click", click);

        function tick() {
            updateLinks()
            updateNodes()
            //updateLinkBox()
            updateLinkLabels()
            
        }

        function click(event, d) {
            delete d.fx;
            delete d.fy;
            d3.select(this).classed("fixed", false);
            d3.select(this).classed("node", true);
            simulation.alpha(1).restart();
        }

        function dragstart() {
            d3.select(this).classed("fixed", true);
            d3.select(this).classed("node", false);

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
            </svg>
        </div>
    );
};

export default StrategyGraph;