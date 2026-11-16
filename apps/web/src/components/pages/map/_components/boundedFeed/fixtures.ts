import type { QuickAccessMap } from '@/components/pages/map/mapQuickAccess/types';

/** Stand-in rows until a bounds-scoped maps query exists. Categories match `maps.list` labels. */
const map = (
    id: string,
    name: string,
    categories: string[],
    subtitle: string | null = null,
    about: string | null = null,
): QuickAccessMap => ({
    id,
    name,
    subtitle,
    about,
    edito: null,
    categories,
});

export const skaterFixtures: QuickAccessMap[] = [
    map('aliboulala', 'Ali Boulala', ['Skaters']),
    map(
        'andrewreynolds',
        'Andrew Reynolds',
        ['Skaters'],
        'The Boss..',
        'Andrew Reynolds (born June 6, 1978) is an American professional skateboarder known for co-founding Baker Skateboards.',
    ),
    map('bastiensalabanzi', 'Bastien Salabanzi', ['Skaters']),
    map(
        'erickoston',
        'Eric Koston',
        ['Skaters'],
        'Froston',
        'The legend! He’s still there having fun! He definitely left his marks on Skateboarding History!',
    ),
    map('marcjohnson', 'Marc Johnson', ['Skaters']),
    map('markappleyard', 'Mark Appleyard', ['Skaters']),
    map('nyjahhuston', 'Nyjah Huston', ['Skaters']),
    map('steviewilliams', 'Stevie Williams', ['Skaters']),
];

export const lensMasterFixtures: QuickAccessMap[] = [
    map(
        'atibajefferson',
        'Atiba Jefferson',
        ['Photographers'],
        null,
        'Atiba has photographed skateboarding extensively for over 20 years, working for Slap, Thrasher, Transworld, and many others.',
    ),
    map(
        'dvl',
        'Davy Van Laere',
        ['Photographers'],
        'DVL',
        'Former pro for Deathbox Skateboards, the Belgian Davy van Laere reconverted into music and photography.',
    ),
    map(
        'fredmortagne',
        'Fred Mortagne',
        ['Filmers'],
        'French Fred',
        'One of the most talented skateboard videographers and photographers!',
    ),
    map('giovannireda', 'Giovanni Reda', ['Photographers']),
    map('mikeblabac', 'Mike Blabac', ['Photographers']),
    map(
        'mikeomeally',
        "Mike O'Meally",
        ['Photographers'],
        null,
        "Mike O'Meally is an international photographer based in Los Angeles, best known for his work in skateboarding.",
    ),
    map('tyevans', 'Ty Evans', ['Filmers']),
    map('williamstrobeck', 'William Strobeck', ['Filmers']),
];
