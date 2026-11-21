import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
    <div className="home">
        <div className="home-hero">
            <p className="home-eyebrow">Knowledge Graphs &amp; Formal Ontologies</p>
            <h1 className="home-title">How do strategic frameworks connect?</h1>
            <p className="home-lead">
                Strategy, business models, and organizational architecture are often treated
                as separate disciplines. This site explores how they interrelate — modelled
                as formal ontologies so the connections can be reasoned about, not just described.
            </p>
            <Button as={Link} to="/ontologies" className="home-cta">
                Browse Ontologies
            </Button>
        </div>

        <div className="home-about">
            <h2>About this project</h2>
            <p>
                Each ontology here captures the vocabulary and relationships of a well-known
                framework — Roger Martin's strategic choice cascade, business model components,
                and others. The goal is to build up a shared conceptual model where a capability
                defined in one framework is recognisably the same concept referenced in another.
            </p>
            <p>
                The ontologies are available to browse interactively and to download as{' '}
                <a href="https://www.w3.org/TR/turtle/" target="_blank" rel="noreferrer">Turtle / OWL</a> files.
            </p>
        </div>
    </div>
);

export default Home;
