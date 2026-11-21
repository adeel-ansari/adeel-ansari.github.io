import strategy from './strategy.json';

export const GROUP_COLORS = {
    'Strategy': '#343a40',
    'Winning Aspiration': '#2f6fb0',
    'Where to Play': '#2f9e8f',
    'How to Win': '#d08a1e',
    'Capabilities': '#8a4fbf',
    'Management Systems': '#c2414b',
    'Actors': '#6c757d',
};

export const GROUP_ORDER = Object.keys(GROUP_COLORS);

export const classById = Object.fromEntries(strategy.classes.map((c) => [c.id, c]));

export const propertiesFor = (classId) =>
    strategy.properties.filter((p) => p.domain === classId);

export const classesInGroup = (group) =>
    strategy.classes.filter((c) => c.group === group);

export const labelFor = (id) => (classById[id] ? classById[id].label : id);

// Builds a fresh node/link structure for the force graph. A new copy is
// returned on every call because d3 mutates nodes and links in place.
export const buildGraph = () => {
    const nodes = strategy.classes.map((c) => ({
        id: c.id,
        label: c.label,
        group: c.group,
    }));
    const links = strategy.properties
        // Self-referencing properties (e.g. CoreCapability.reinforcingRelationship)
        // are listed in the grid view; they would draw as zero-length lines here.
        .filter((p) => p.kind === 'object' && classById[p.range] && p.domain !== p.range)
        .map((p) => ({
            source: p.domain,
            target: p.range,
            link_label: p.id.split('.')[1],
            kind: 'property',
        }));
    strategy.classes
        .filter((c) => c.subClassOf)
        .forEach((c) => {
            links.push({ source: c.id, target: c.subClassOf, link_label: 'subClassOf', kind: 'subclass' });
        });
    return { nodes, links };
};

export default strategy;
