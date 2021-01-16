import React from 'react';
import { Jumbotron, Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


const Home = () => {

    return (
        <div>
            <Jumbotron>
                <h1>Adeel Ansari</h1>
                <p>
                    Welcome to my page where I explore using knowledge graphs to improve organizational performance.
            </p>
                <p>
                    <Button as={Link} to="/ontologies" variant="primary">Explore Ontologies</Button>
                </p>
            </Jumbotron>
            <br >
            </br>
            {/* <Container>
                <Row>
                    <Col>
                        <h2>
                            Opportunity
                        </h2>
                        <p>
                            Model business frameworks using OWL/RDF and demostrate how storing, sharing, and analyzing
                            this type of data can help solve important business challenges.
                        </p>
                    </Col>
                    <Col>
                        <h2>
                            Solution
                        </h2>
                        <p>
                            You can contact me through LinkedIn or email.
                        </p>
                    </Col>
                    <Col>
                        <h2>
                            About Me
                        </h2>
                        <p>
                            I hold a Bachelors of Computer Science and an MBA.  My work experience primarily includes
                            data engineering and product management.  You can contact me through LinkedIn or by email.
                        </p>
                    </Col>
                </Row>
            </Container> */}
        </div>
    );
};

export default Home;