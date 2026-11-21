import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
    const { hash } = useLocation();
    const active = (path) => hash === `#${path}` || (path === '/' && hash === '');

    return (
        <Navbar expand="lg" className="site-nav">
            <Container fluid className="site-nav-inner">
                <Navbar.Brand as={Link} to="/" className="site-nav-brand">
                    Adeel Ansari
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" className="site-nav-toggle" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" className={active('/') ? 'active' : ''}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/ontologies" className={active('/ontologies') ? 'active' : ''}>
                            Ontologies
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
