import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const NavigationBar = () => {

    return (
        <Navbar bg="light" expand="lg">
            {/* <Navbar.Brand href="#home">adeelansari.io</Navbar.Brand> */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    {/* <NavDropdown title="Ontologies" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#ontology/strategicchoicecascade">Strategic Choice Cascade</NavDropdown.Item>
                        <NavDropdown.Item href="#ontology/businessmodel">Business Model</NavDropdown.Item>
                        <NavDropdown.Item href="#ontology/anotherontology">Another Ontology</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#ontology/anotherlink">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                </Nav>
                {/* <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="primary">Search</Button>
                </Form> */}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;