import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ForceGraph3 from '../TestGraph/ForceGraph3';
import StrategyGridView from './StrategyGridView';
import { Tabs, Tab, Container } from 'react-bootstrap';

const graph = ({
    nodes: [
        {
            index: 0,
            id: "a",
            name: "Adeel"
        },
        {
            index: 1,
            id: "b",
            name: "Khadijah"
        },
        {
            index: 2,
            id: "c",
            name: "Afeefa"
        }
    ],
    links: [
        { source: "Adeel", target: "Khadijah" },
        { source: "Khadijah", target: "Afeefa" },
        { source: "Adeel", target: "Afeefa" }
    ]
});

const Tabview = () => {

    return (
        <Tabs defaultActiveKey="graphview" id="uncontrolled-tab-example">
            <Tab eventKey="gridview" title="Grid View">
                    <br />
                    <StrategyGridView />
            </Tab>
            <Tab eventKey="graphview" title="Graph View">
                <Container>
                    <br />
                    <ForceGraph3 width={800} height={600} graph={graph} />
                </Container>
            </Tab>
            <Tab eventKey="example" title="Example">
                <Container>
                    <br />
                    This tab will contain an example for the ontology.
                </Container>
            </Tab>
        </Tabs>
    );
};

export default Tabview;