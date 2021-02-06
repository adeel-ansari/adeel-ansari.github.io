import React from 'react';
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import StrategyGraph from '../StrategyGraphView/StrategyGraph';
import StrategyGridView from './StrategyGridView';
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap';


const Tabview = (props) => {

    const [graph, setGraph] = useState({});
    const [showResult, setShowResult] = useState(false);

    const getGraphData = async () => {
        try {
            const response = await fetch('https://adeeltestfunctionapp.azurewebsites.net/api/GetGraphStructure?clientId=apim-AdeelTestFunctionApp-apim2', {
                method: 'GET'
            });
            const graphData = await response.json();            
            const updatedGraphData = { ...graphData }
            console.log(updatedGraphData)
            setGraph(updatedGraphData)
            setShowResult(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!props.fetched) {
            getGraphData();
        }
    }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

    return (
        //<Container>
        <div>
            { showResult ? (
                <Tabs defaultActiveKey="graphview" id="uncontrolled-tab-example">
                    <Tab eventKey="gridview" title="Grid View">
                        <br />
                        <StrategyGridView />
                    </Tab>
                    <Tab eventKey="graphview" title="Graph View">
                        <br />
                        <StrategyGraph graph={graph} />
                    </Tab>
                    <Tab eventKey="example" title="Example">
                        <br />
                        This tab will contain an example for the ontology.
                    </Tab>
                </Tabs>
            ): (
                <div>
                    <br />
                    <Spinner animation="border" variant="success" />
                    <h2>Loading</h2>
                </div>
            )}
        </div>
        //</Container>
    );
};

export default Tabview;