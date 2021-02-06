import React from 'react';
import { useState, useEffect } from "react";
import { Table, Container } from 'react-bootstrap';
import './StrategyGridView.css';



const StrategyGridView = (props) => {
    const [ontologyData, setOntologyData] = useState({
        //ontolology_dict: {},
    });

    const getOntologyData = async () => {
        try {
            const response = await fetch('https://adeeltestfunctionapp.azurewebsites.net/api/GetOntologyDetail?clientId=apim-AdeelTestFunctionApp-apim2', {
                method: 'GET'
            });
            const ontologyData = await response.json();            
            const updatedOntologyData = { ...ontologyData }
            console.log(updatedOntologyData)
            setOntologyData(updatedOntologyData)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!props.fetched) {
            getOntologyData();
        }
    }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

    return (
        Object.keys(ontologyData).map((key, index) => {
            return (
                <Container key={key}>
                    <h3>
                        {key}
                    </h3>
                    {ontologyData[key]['Description'].map((class_desc) => {
                        return (
                            <p>
                                {class_desc['Class Description']}
                            </p>
                        )})}
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Attribute Name</th>
                                <th>Attribute Type</th>
                                <th>Attribute Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ontologyData[key]['Properties'].map((class_attr) => {
                                    return (
                                        <tr>
                                            <td>{class_attr['Property']}</td>
                                            <td>{class_attr['Property Type']}</td>
                                            <td>{class_attr['Property Description']}</td>
                                        </tr>)
                                })
                            }
                        </tbody>
                    </Table>
                    <br />
                </Container>
            )
        })
    );
};

export default StrategyGridView;