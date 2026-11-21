import React from 'react';
import { Link } from 'react-router-dom';
import strategy from '../../ontology';
import './OntologyHome.css';

const OntologyHome = () => (
    <div>
        <div className="onto-header">
            <h1>Ontologies</h1>
            <p className="onto-intro">
                Each entry below is a formal model of a strategic or business framework —
                capturing its concepts, their properties, and how they relate to each other.
                Over time these ontologies will be linked so that concepts shared across
                frameworks point to the same underlying definition.
            </p>
        </div>

        <div className="onto-grid">
            <div className="onto-card">
                <div className="onto-card-tag">Strategy</div>
                <h2 className="onto-card-title">Strategic Choice Cascade</h2>
                <p className="onto-card-desc">
                    Based on <em>Playing to Win</em> by A.G. Lafley and Roger L. Martin.
                    Models the five strategic choices — winning aspiration, where to play,
                    how to win, must-have capabilities, and enabling management systems —
                    and the links between them.
                </p>
                <div className="onto-card-meta">
                    {strategy.classes.length} classes &middot; {strategy.properties.length} properties
                </div>
                <Link to="/ontologyDetail" className="onto-card-link">
                    Explore →
                </Link>
            </div>
        </div>
    </div>
);

export default OntologyHome;
