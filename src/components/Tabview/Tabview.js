import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ForceGraph3 from '../TestGraph/ForceGraph3';
import StrategyGridView from './StrategyGridView';
import { Tabs, Tab, Container } from 'react-bootstrap';

// const graph = ({
//     nodes: [
//         {
//             index: 0,
//             id: "a",
//             name: "Adeel"
//         },
//         {
//             index: 1,
//             id: "b",
//             name: "Khadijah"
//         },
//         {
//             index: 2,
//             id: "c",
//             name: "Afeefa"
//         }
//     ],
//     links: [
//         { source: "Adeel", target: "Khadijah" },
//         { source: "Khadijah", target: "Afeefa" },
//         { source: "Adeel", target: "Afeefa" }
//     ]
// });

const graph = (
    {
        'links': [
            { 'source': 'WhereToPlay', 'target': 'DistributionChannel' },
            { 'source': 'WhereToPlay', 'target': 'VerticalStageOfProduction' },
            { 'source': 'WhereToPlay', 'target': 'ProductType' },
            { 'source': 'WhereToPlay', 'target': 'ConsumerSegment' },
            { 'source': 'WhereToPlay', 'target': 'Geography' },
            { 'source': 'Consumer', 'target': 'ConsumerSegment' },
            { 'source': 'strategy', 'target': 'ManagementSystem' },
            { 'source': 'strategy', 'target': 'string' },
            { 'source': 'strategy', 'target': 'WinningAspiration' },
            { 'source': 'strategy', 'target': 'HowToWin' },
            { 'source': 'strategy', 'target': 'CoreCapability' },
            { 'source': 'strategy', 'target': 'dateTime' },
            { 'source': 'strategy', 'target': 'WhereToPlay' },
            { 'source': 'Organization', 'target': 'strategy' },
            { 'source': 'WinningAspiration', 'target': 'string' },
            { 'source': 'WinningAspiration', 'target': 'ConsumerSegment' },
            { 'source': 'WinningAspiration', 'target': 'Competitor' },
            { 'source': 'Organization', 'target': 'ActivitySystem' },
            { 'source': 'ActivitySystem', 'target': 'CoreCapability' },
            { 'source': 'Customer', 'target': 'CustomerSegment' },
            { 'source': 'CoreCapability', 'target': 'CoreCapability' },
            { 'source': 'CoreCapability', 'target': 'Activity' },
            { 'source': 'CoreCapability', 'target': 'CoreCapability' }
        ],
        'nodes': [
            { 'id': 'DistributionChannel' },
            { 'id': 'VerticalStageOfProduction' },
            { 'id': 'ProductType' },
            { 'id': 'ConsumerSegment' },
            { 'id': 'Geography' },
            { 'id': 'Consumer' },
            { 'id': 'ConsumerSegment' },
            { 'id': 'ManagementSystem' },
            { 'id': 'string' },
            { 'id': 'WinningAspiration' },
            { 'id': 'HowToWin' },
            { 'id': 'CoreCapability' },
            { 'id': 'dateTime' },
            { 'id': 'strategy' },
            { 'id': 'WhereToPlay' },
            { 'id': 'Organization' },
            { 'id': 'strategy' },
            { 'id': 'ConsumerSegment' },
            { 'id': 'Competitor' },
            { 'id': 'ActivitySystem' },
            { 'id': 'Customer' },
            { 'id': 'CustomerSegment' },
            { 'id': 'CoreCapability' },
            { 'id': 'Activity' }]
    }
)

const Tabview = () => {

    return (
        <Container>
            <Tabs defaultActiveKey="gridview" id="uncontrolled-tab-example">
                <Tab eventKey="gridview" title="Grid View">
                    <br />
                    <StrategyGridView />
                </Tab>
                <Tab eventKey="graphview" title="Graph View">
                    <br />
                    <ForceGraph3 width={1400} height={1200} graph={graph} />
                </Tab>
                <Tab eventKey="example" title="Example">
                    <br />
                    This tab will contain an example for the ontology.
            </Tab>
            </Tabs>
        </Container>
    );
};

export default Tabview;