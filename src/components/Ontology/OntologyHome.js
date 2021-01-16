import React from 'react';
import { Card, Button, Row } from 'react-bootstrap';
import Layout from '../Layout/Layout';
import Iframe from 'react-iframe'
import { Link } from 'react-router-dom';

const OntologyHome = () => {

    return (
        <Row className="justify-content-center">
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Strategy</Card.Title>
                    <Card.Text>
                        This ontology is based on the book, 'Playing to Win' by A.G. Lafley and Roger L. Martin.
                        It provides some of the foundational components that can be used to link an organizations
                        activities.
                    </Card.Text>
                    <Button
                        // as={Link}
                        // to="/ontologyDetail"
                        // variant="primary"
                        disabled>
                        Enter
                    </Button>
                </Card.Body>
                {/* <Card.Footer className="text-muted">
                    <Iframe url="https://read.amazon.ca/kp/card?asin=B00AJVJ1HI&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp_aW5.FbG44G6SR"
                        width="336px"
                        height="550px"
                        id="myId"
                        className="myClassname"
                        display="initial"
                        position="relative" />
                </Card.Footer> */}
            </Card>
        </Row>
    );
};

export default OntologyHome;