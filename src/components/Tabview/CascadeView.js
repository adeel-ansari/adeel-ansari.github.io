import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import strategy, { classById, classesInGroup, GROUP_COLORS } from '../../ontology';
import './Cascade.css';

const CascadeView = () => (
    <div className="cascade">
        {strategy.cascade.map((step) => {
            const cls = classById[step.classId];
            const color = GROUP_COLORS[cls.group];
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
                                <Badge variant="dark" className="mr-1">{cls.id}</Badge>
                                {related.map((c) => (
                                    <Badge key={c.id} variant="light" className="mr-1 border">{c.id}</Badge>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                    {step.step < strategy.cascade.length && <div className="cascade-arrow" aria-hidden="true">&#8595;</div>}
                </div>
            );
        })}
        <p className="text-muted mt-3">
            The choices are linked: each one sets the context for the next, and the arrows also run back
            up, because a choice lower in the cascade can show that a higher one needs to change. Strategies
            also nest, with one level's where-to-play and how-to-win choices shaping the aspiration of the
            level below (<code>Strategy.parentStrategy</code>).
        </p>
    </div>
);

export default CascadeView;
