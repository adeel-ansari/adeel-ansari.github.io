import React from 'react';
import { Link } from 'react-router-dom';
import { REGISTRY } from '../../ontology/registry';
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
            {REGISTRY.map((entry) => (
                <div key={entry.slug} className="onto-card">
                    <div className="onto-card-tag">{entry.tag}</div>
                    <h2 className="onto-card-title">{entry.title}</h2>
                    <p className="onto-card-desc">{entry.description}</p>
                    <div className="onto-card-meta">
                        {entry.module.default.classes.length} classes &middot;{' '}
                        {entry.module.default.properties.length} properties
                    </div>
                    <Link to={`/ontologies/${entry.slug}`} className="onto-card-link">
                        Explore →
                    </Link>
                </div>
            ))}
        </div>
    </div>
);

export default OntologyHome;
