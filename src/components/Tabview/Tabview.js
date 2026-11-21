import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import StrategyGraph from '../StrategyGraphView/StrategyGraph';
import StrategyGridView from './StrategyGridView';
import CascadeView from './CascadeView';
import ExampleView from './ExampleView';
import strategy from '../../ontology';

// The ontology used to be fetched from an Azure Function at runtime. That
// service is no longer reachable, which left this page stuck on its loading
// spinner. The ontology now ships with the site (src/ontology/strategy.json).
const Tabview = () => (
   <div className="text-left">
       <h2>{strategy.title}</h2>
       <p className="lead">{strategy.description}</p>
       <p>
           <a href={`${process.env.PUBLIC_URL}/ontologies/strategy.ttl`} download>
               Download the ontology (Turtle / OWL)
           </a>
       </p>
       <Tabs defaultActiveKey="cascade" id="ontology-tabs" mountOnEnter>
           <Tab eventKey="cascade" title="Choice Cascade">
               <br />
               <CascadeView />
           </Tab>
           <Tab eventKey="gridview" title="Grid View">
               <br />
               <StrategyGridView />
           </Tab>
           <Tab eventKey="graphview" title="Graph View">
               <br />
               <StrategyGraph />
           </Tab>
           <Tab eventKey="example" title="Example">
               <br />
               <ExampleView />
           </Tab>
       </Tabs>
       <p className="text-muted mt-4"><small>Source: {strategy.citation}</small></p>
   </div>
);

export default Tabview;
