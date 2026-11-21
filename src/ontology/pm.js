import data from './projectmanagement.json';

export const GROUP_COLORS = {
    'Vision':    '#c47c3a',
    'Feature':   '#7a8c5e',
    'Execution': '#5e7d8c',
    'Quality':   '#8c6b7a',
    'Team':      '#9e9087',
};

export const GROUP_ORDER = Object.keys(GROUP_COLORS);

// Groups that form the top-to-bottom delivery hierarchy in the graph.
// 'Team' goes in a separate column on the right (like 'Actors' in strategy).
export const LAYOUT = {
    cascadeGroups: ['Vision', 'Feature', 'Execution', 'Quality'],
    supportingGroups: ['Team'],
};

export const classById = Object.fromEntries(data.classes.map((c) => [c.id, c]));

export const propertiesFor = (classId) =>
    data.properties.filter((p) => p.domain === classId);

export const classesInGroup = (group) =>
    data.classes.filter((c) => c.group === group);

export const labelFor = (id) => (classById[id] ? classById[id].label : id);

export const buildGraph = () => {
    const nodes = data.classes.map((c) => ({
        id: c.id,
        label: c.label,
        group: c.group,
    }));
    const links = data.properties
        .filter((p) => p.kind === 'object' && classById[p.range] && p.domain !== p.range)
        .map((p) => ({
            source: p.domain,
            target: p.range,
            link_label: p.id.split('.')[1] ?? p.id,
            kind: 'property',
        }));
    data.classes
        .filter((c) => c.subClassOf)
        .forEach((c) => {
            links.push({ source: c.id, target: c.subClassOf, link_label: 'subClassOf', kind: 'subclass' });
        });
    return { nodes, links };
};

export default data;
