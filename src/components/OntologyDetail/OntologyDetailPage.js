import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { ONTOLOGY_BY_SLUG } from '../../ontology/registry';
import OntologyGridView from './OntologyGridView';
import OntologyGraph    from './OntologyGraph';
import HierarchyView    from './HierarchyView';
import CascadeView      from '../Tabview/CascadeView';
import ExampleView      from '../Tabview/ExampleView';
import './OntologyDetailPage.css';

const OntologyDetailPage = () => {
    const { slug } = useParams();
    const entry = ONTOLOGY_BY_SLUG[slug];

    if (!entry) return <Navigate to="/ontologies" replace />;

    const { tag, title, module: ont } = entry;
    const data         = ont.default;
    const hasCascade   = Array.isArray(data.cascade);
    const hasHierarchy = Array.isArray(data.hierarchy) && !hasCascade;
    const hasExample   = !!data.example;

    // Framework tab label differs by type
    const frameworkLabel = hasCascade ? 'Choice Cascade' : 'Hierarchy';

    return (
        <div>
            <div className="onto-detail-header">
                <p className="onto-detail-tag">{tag}</p>
                <h1 className="onto-detail-title">{data.title ?? title}</h1>
                <p className="onto-detail-desc">{data.description}</p>
                {data.prefix && (
                    <a
                        href={`${process.env.PUBLIC_URL}/ontologies/${data.prefix === 'strat' ? 'strategy' : slug}.ttl`}
                        download
                        className="onto-detail-download"
                    >
                        ↓ Download Turtle / OWL
                    </a>
                )}
            </div>

            <Tabs defaultActiveKey="graph" id="ontology-tabs" mountOnEnter className="onto-tabs">
                <Tab eventKey="graph" title="Graph">
                    <div className="onto-tab-body onto-tab-body--graph">
                        <OntologyGraph ontologyModule={ont} />
                    </div>
                </Tab>

                {(hasCascade || hasHierarchy) && (
                    <Tab eventKey="framework" title={frameworkLabel}>
                        <div className="onto-tab-body">
                            {hasCascade
                                ? <CascadeView ontologyModule={ont} />
                                : <HierarchyView ontologyModule={ont} />}
                        </div>
                    </Tab>
                )}

                <Tab eventKey="classes" title="Classes">
                    <div className="onto-tab-body">
                        <OntologyGridView ontologyModule={ont} />
                    </div>
                </Tab>

                {hasExample && (
                    <Tab eventKey="example" title="Example">
                        <div className="onto-tab-body">
                            <ExampleView ontologyModule={ont} />
                        </div>
                    </Tab>
                )}
            </Tabs>

            <p className="onto-detail-citation">{data.citation}</p>
        </div>
    );
};

export default OntologyDetailPage;
