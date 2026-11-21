import React from 'react';
import { Table, Container } from 'react-bootstrap';
import './OntologyGridView.css';

const rangeLabel = (range, labelFor) =>
    range.startsWith('xsd:') ? range : labelFor(range);

const OntologyGridView = ({ ontologyModule }) => {
    const { GROUP_ORDER, GROUP_COLORS, classesInGroup, propertiesFor, labelFor, default: data } = ontologyModule;

    return (
        <Container fluid className="px-0">
            {GROUP_ORDER.map((group) => (
                <section key={group} className="mb-4">
                    <h3 className="grid-group" style={{ borderBottomColor: GROUP_COLORS[group] }}>
                        {group}
                    </h3>
                    {classesInGroup(group).map((cls) => {
                        const props = propertiesFor(cls.id);
                        return (
                            <div key={cls.id} className="mb-3">
                                <h5>
                                    {cls.label}{' '}
                                    <code>{cls.id}</code>
                                    {cls.subClassOf && (
                                        <small className="text-muted">
                                            {' '}subclass of {labelFor(cls.subClassOf)}
                                        </small>
                                    )}
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
                                                    <td>{rangeLabel(p.range, labelFor)}</td>
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
                {data.classes.length} classes and {data.properties.length} properties.
            </p>
        </Container>
    );
};

export default OntologyGridView;
