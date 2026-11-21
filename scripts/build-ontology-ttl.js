#!/usr/bin/env node
// Generates the Turtle (OWL) version of the strategy ontology from
// src/ontology/strategy.json, which is the single source of truth used by the
// web app. Run with: npm run build:ontology
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/ontology/strategy.json'), 'utf8'));

const outputs = [
    path.join(root, 'public/ontologies/strategy.ttl'),
    path.join(root, 'artifacts/ontologies/strategy.ttl'),
];

const literal = (text) => `"${String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"@en`;

const classById = Object.fromEntries(data.classes.map((c) => [c.id, c]));
const ref = (id) => {
    if (id.startsWith('xsd:')) return id;
    const cls = classById[id];
    if (cls && cls.iri) return `<${cls.iri}>`;
    return `:${id}`;
};

const lines = [];
const push = (...l) => lines.push(...l);

push(
    `@prefix : <${data.iri}#> .`,
    '@prefix owl: <http://www.w3.org/2002/07/owl#> .',
    '@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .',
    '@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .',
    '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .',
    '@prefix dcterms: <http://purl.org/dc/terms/> .',
    `@base <${data.iri}> .`,
    '',
    '# Generated from src/ontology/strategy.json by scripts/build-ontology-ttl.js.',
    '# Edit the JSON file and re-run `npm run build:ontology` rather than editing this file.',
    '',
    `<${data.iri}> rdf:type owl:Ontology ;`,
    `    dcterms:title ${literal(data.title)} ;`,
    `    dcterms:description ${literal(data.description)} ;`,
    `    dcterms:bibliographicCitation ${literal(data.citation)} ;`,
    `    owl:versionInfo "${data.version}" .`,
    '',
    'dcterms:title rdf:type owl:AnnotationProperty .',
    'dcterms:description rdf:type owl:AnnotationProperty .',
    'dcterms:bibliographicCitation rdf:type owl:AnnotationProperty .',
    '',
    '#################################################################',
    '#    Classes',
    '#################################################################',
    '',
);

const cascadeByClass = Object.fromEntries(data.cascade.map((c) => [c.classId, c]));

data.classes.forEach((cls) => {
    const stmts = ['rdf:type owl:Class'];
    if (cls.subClassOf) stmts.push(`rdfs:subClassOf ${ref(cls.subClassOf)}`);
    stmts.push(`rdfs:label ${literal(cls.label)}`);
    const step = cascadeByClass[cls.id];
    if (step) {
        stmts.push(`rdfs:comment ${literal(`Strategic choice cascade, step ${step.step}: ${step.question}`)}`);
    }
    stmts.push(`dcterms:description ${literal(cls.description)}`);
    if (!cls.iri) stmts.push(`dcterms:bibliographicCitation ${literal(data.citation)}`);
    push(`${ref(cls.id)} ${stmts.join(' ;\n    ')} .`, '');
});

const writeProps = (kind, heading, owlType) => {
    push(
        '#################################################################',
        `#    ${heading}`,
        '#################################################################',
        '',
    );
    data.properties
        .filter((p) => p.kind === kind)
        .forEach((p) => {
            const stmts = [
                `rdf:type ${owlType}`,
                `rdfs:domain ${ref(p.domain)}`,
                `rdfs:range ${ref(p.range)}`,
                `rdfs:label ${literal(p.id)}`,
                `dcterms:description ${literal(p.description)}`,
            ];
            push(`:${p.id} ${stmts.join(' ;\n    ')} .`, '');
        });
};

writeProps('object', 'Object properties', 'owl:ObjectProperty');
writeProps('datatype', 'Datatype properties', 'owl:DatatypeProperty');

const ttl = lines.join('\n');
outputs.forEach((file) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, ttl);
    console.log(`Wrote ${path.relative(root, file)}`);
});
