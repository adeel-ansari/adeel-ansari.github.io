import { Container } from 'react-bootstrap';
import React from 'react';
import './Layout.css';

export const Layout = (props) => (
    <Container fluid className="Container">
        {props.children}
    </Container>
)
export default Layout;
