import React from 'react';
import { Table, Container } from 'react-bootstrap';
import strategy, { GROUP_ORDER, GROUP_COLORS, classesInGroup, propertiesFor, labelFor } from '../../ontology';
import './StrategyGridView.css';

const rangeLabel = (range) => (range.startsWith('xsd:') ? range : labelFor(range));

const StrategyGridView = () => (
   <Container fluid className="px-0">
       {GROUP_ORDER.map((group) => (
           <section key={group} className="mb-4">
               <h3 className="grid-group" style={{ borderBottomColor: GROUP_COLORS[group] }}>{group}</h3>
               {classesInGroup(group).map((cls) => {
                   const props = propertiesFor(cls.id);
                   return (
                       <div key={cls.id} className="mb-3">
                           <h5>
                               {cls.label} <code>{cls.id}</code>
                               {cls.subClassOf && <small className="text-muted"> subclass of {labelFor(cls.subClassOf)}</small>}
                           </h5>
                           <p>{cls.description}</p>
                           {props.length > 0 && (
                               <Table striped bordered hover responsive size="sm">
                                   <thead>
                                        <tr>
                                           <th>Property</th>
                                           <th>Type</th>
                                           <th>Range</th>
                                           <th>Description</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {props.map((p) => (
                                           <tr key={p.id}>
                                               <td><code>{p.id}</code></td>
                                               <td>{p.kind === 'object' ? 'Object' : 'Datatype'}</td>
                                               <td>{rangeLabel(p.range)}</td>
                                               <td>{p.description}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </Table>
                           )}
                       </div>
                   );
               })}
           </section>
       ))}
       <p className="text-muted">
           {strategy.classes.length} classes and {strategy.properties.length} properties.
       </p>
   </Container>
);

export default StrategyGridView;
