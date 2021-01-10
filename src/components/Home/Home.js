import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


const Home = () => {

    return (
        <Jumbotron>
            <h1>adeel-ansari</h1>
            <p>
                Welcome to my page where I explore using knowledge graphs to improve organizational performance.
            </p>
            <p>
                <Button variant="primary" disabled>Explore Ontologies</Button>
            </p>
        </Jumbotron>
    );
};

export default Home;