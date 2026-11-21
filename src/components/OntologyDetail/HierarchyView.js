import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './HierarchyView.css';

// Generic hierarchy view — works with any ontology that has a `hierarchy` array
// in its JSON (same shape as `cascade`: step, classId, title, question, summary).
const HierarchyView = ({ ontologyModule }) => {
    const { default: data, classById, classesInGroup, GROUP_COLORS } = ontologyModule;

    return (
        <div className="hierarchy">
            {data.hierarchy.map((step) => {
                const cls    = classById[step.classId];
                const color  = GROUP_COLORS[cls.group];
                const related = classesInGroup(cls.group).filter((c) => c.id !== cls.id);

                return (
                    <div key={step.step} className="hierarchy-step">
                        <Card className="hierarchy-card" style={{ borderLeftColor: color }}>
                            <Card.Body>
                                <div className="hierarchy-number" style={{ backgroundColor: color }}>
                                    {step.step}
                                </div>
                                <Card.Title>{step.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{step.question}</Card.Subtitle>
                                <Card.Text>{step.summary}</Card.Text>
                                <div>
                                    <Badge bg="dark" className="me-1">{cls.id}</Badge>
                                    {related.map((c) => (
                                        <Badge key={c.id} bg="light" text="dark" className="me-1 border">
                                            {c.id}
                                        </Badge>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                        {step.step < data.hierarchy.length && (
                            <div className="hierarchy-arrow" aria-hidden="true">↓</div>
                        )}
                    </div>
                );
            })}
            <p className="text-muted mt-3" style={{ maxWidth: 680, fontSize: '0.875rem' }}>
                The hierarchy flows top-down: themes contain epics, epics decompose into stories,
                and stories break into tasks. Each level provides the context that shapes the
                level below it.
            </p>
        </div>
    );
};

export default HierarchyView;
