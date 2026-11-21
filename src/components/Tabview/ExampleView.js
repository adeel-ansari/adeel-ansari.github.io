import React from 'react';
import { Card } from 'react-bootstrap';
import strategy, { classById, GROUP_COLORS } from '../../ontology';
import './Cascade.css';

const ExampleView = () => {
    const { example, cascade } = strategy;
    return (
        <div className="cascade">
            <h4>{example.title}</h4>
            <p className="text-muted">{example.source}</p>
            {example.choices.map((choice) => {
                const step = cascade.find((s) => s.step === choice.step);
                const color = GROUP_COLORS[classById[step.classId].group];
                return (
                    <div key={choice.step} className="cascade-step">
                        <Card className="cascade-card" style={{ borderLeftColor: color }}>
                            <Card.Body>
                                <div className="cascade-number" style={{ backgroundColor: color }}>{step.step}</div>
                                <Card.Title>{step.title}</Card.Title>
                                <ul className="example-list">
                                    {choice.items.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                            </Card.Body>
                        </Card>
                        {choice.step < cascade.length && <div className="cascade-arrow" aria-hidden="true">&#8595;</div>}
                    </div>
                );
            })}
        </div>
    );
};

export default ExampleView;
