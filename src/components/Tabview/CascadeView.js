import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import defaultStrategy, { classById as defaultClassById, classesInGroup as defaultClassesInGroup, GROUP_COLORS as defaultGroupColors } from '../../ontology';
import './Cascade.css';

const CascadeView = ({ ontologyModule }) => {
    const data           = ontologyModule ? ontologyModule.default    : defaultStrategy;
    const classById      = ontologyModule ? ontologyModule.classById   : defaultClassById;
    const classesInGroup = ontologyModule ? ontologyModule.classesInGroup : defaultClassesInGroup;
    const GROUP_COLORS   = ontologyModule ? ontologyModule.GROUP_COLORS  : defaultGroupColors;

    return (
        <div className="cascade">
            {data.cascade.map((step) => {
                const cls     = classById[step.classId];
                const color   = GROUP_COLORS[cls.group];
                const related = classesInGroup(cls.group).filter((c) => c.id !== cls.id);
                return (
                    <div key={step.step} className="cascade-step">
                        <Card className="cascade-card" style={{ borderLeftColor: color }}>
                            <Card.Body>
                                <div className="cascade-number" style={{ backgroundColor: color }}>{step.step}</div>
                                <Card.Title>{step.title}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{step.question}</Card.Subtitle>
                                <Card.Text>{step.summary}</Card.Text>
                                <div>
                                    <Badge bg="dark" className="me-1">{cls.id}</Badge>
                                    {related.map((c) => (
                                        <Badge key={c.id} bg="light" text="dark" className="me-1 border">{c.id}</Badge>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                        {step.step < data.cascade.length && (
                            <div className="cascade-arrow" aria-hidden="true">↓</div>
                        )}
                    </div>
                );
            })}
            <p className="text-muted mt-3" style={{ maxWidth: 680, fontSize: '0.875rem' }}>
                The choices are linked: each one sets the context for the next, and the arrows also run back
                up, because a choice lower in the cascade can show that a higher one needs to change. Strategies
                also nest, with one level's where-to-play and how-to-win choices shaping the aspiration of the
                level below (<code>Strategy.parentStrategy</code>).
            </p>
        </div>
    );
};

export default CascadeView;
