import React from 'react';
import { Card, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import strategy from '../../ontology';

const OntologyHome = () => (
    <Row className="justify-content-center">
        <Card style={{ width: '22rem' }} className="text-left">
            <Card.Body>
                <Card.Title>Strategy</Card.Title>
                <Card.Text>
                    This ontology is based on the book 'Playing to Win' by A.G. Lafley and Roger L. Martin.
                    It models Roger Martin's strategic choice cascade (winning aspiration, where to play,
                    how to win, must-have capabilities and enabling management systems) so that an
                    organization's activities can be linked back to the choices they support.
                </Card.Text>
                <Card.Text className="text-muted">
                    {strategy.classes.length} classes, {strategy.properties.length} properties
                </Card.Text>
                <Button as={Link} to="/ontologyDetail" variant="primary">
                    Enter
                </Button>
            </Card.Body>
        </Card>
    </Row>
);

export default OntologyHome;
