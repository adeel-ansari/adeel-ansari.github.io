import strategyModule from './index';
import pmModule from './pm';

// Central registry of all ontologies.
// Add a new entry here whenever a new ontology JSON + module is created.
// The slug is used as the URL path segment: /ontologies/:slug
export const REGISTRY = [
    {
        slug: 'strategy',
        tag: 'Strategy',
        title: 'Strategic Choice Cascade',
        description:
            "Based on Playing to Win by A.G. Lafley and Roger L. Martin. Models Roger Martin's " +
            'five linked strategic choices — winning aspiration, where to play, how to win, ' +
            'must-have capabilities and enabling management systems.',
        module: strategyModule,
    },
    {
        slug: 'pm',
        tag: 'Agile',
        title: 'Agile Project Management',
        description:
            'Models the core concepts of agile delivery — themes, epics, user stories, tasks, ' +
            'sprints and backlogs — and how they relate to one another and to the people who ' +
            'own and facilitate the work.',
        module: pmModule,
    },
];

// Convenience map: slug → registry entry
export const ONTOLOGY_BY_SLUG = Object.fromEntries(REGISTRY.map((e) => [e.slug, e]));
