import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import StrategyGraph from '../StrategyGraphView/StrategyGraph';
import StrategyGridView from './StrategyGridView';
import CascadeView from './CascadeView';
import ExampleView from './ExampleView';
import strategy from '../../ontology';
import './Tabview.css';

// The ontology used to be fetched from an Azure Function at runtime. That
// service is no longer reachable, which left this page stuck on its loading
// spinner. The ontology now ships with the site (src/ontology/strategy.json).
const Tabview = () => (
    <div>
        <div className="onto-detail-header">
            <p className="onto-detail-tag">Strategy</p>
            <h1 className="onto-detail-title">{strategy.title}</h1>
            <p className="onto-detail-desc">{strategy.description}</p>
            <a
                href={`${process.env.PUBLIC_URL}/ontologies/strategy.ttl`}
                download
                className="onto-detail-download"
            >
                Download Turtle / OWL
            </a>
        </div>

        <Tabs defaultActiveKey="cascade" id="ontology-tabs" mountOnEnter className="onto-tabs">
            <Tab eventKey="cascade" title="Choice Cascade">
                <div className="onto-tab-body">
                    <CascadeView />
                </div>
            </Tab>
            <Tab eventKey="gridview" title="Grid View">
                <div className="onto-tab-body">
                    <StrategyGridView />
                </div>
            </Tab>
            <Tab eventKey="graphview" title="Graph View">
                <div className="onto-tab-body">
                    <StrategyGraph />
                </div>
            </Tab>
            <Tab eventKey="example" title="Example">
                <div className="onto-tab-body">
                    <ExampleView />
                </div>
            </Tab>
        </Tabs>

        <p className="onto-detail-citation">{strategy.citation}</p>
    </div>
);

export default Tabview;
