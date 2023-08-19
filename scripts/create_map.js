const file = require('fs');

const getParam = (param, required = false) => {
    const idx = process.argv.indexOf(param);

    if (idx === -1) {
        if (required) {
            throw new Error(`Missing param: ${param}`);
        }
        return '';
    }

    if (idx + 1 >= process.argv.length) {
        throw new Error(`Missing value for param: ${param}`);
    }

    // If the next param starts with '--' it means the current param has no value
    if (process.argv[idx + 1].indexOf('--') !== -1) {
        return '';
    }

    return process.argv[idx + 1];
};

/**
 * How to use:
 * node create_map.js \
 *  --tag <tag> \
 *  --name <name> \
 *  --category <category> \
 *  --subtitle <subtitle> \
 *  --edito <edito> \
 *  --about <about> \
 *  --videos <videos>
 */
const main = () => {
    const tag = getParam('--tag', true);
    const name = getParam('--name', true);
    const category = getParam('--category', true);
    const subtitle = getParam('--subtitle');
    const edito = getParam('--edito');
    const about = getParam('--about');
    let videos = getParam('--videos');

    if (videos !== '') {
        videos = videos.split(',');
    } else {
        videos = [];
    }

    const videosString = videos.map((video) => `'${video}'`).join(',');

    const map = `
    {
        id: '${tag},
        categories: ['${category}'],
        name: '${name}',
        subtitle: '${subtitle}',
        edito: '${edito}',
        about: '${about}',
        videos: [${videosString}],
        spots: required('data/customMaps/${tag}.json'),
    }`;

    const maps = file.readFileSync('data/customMaps/_spots.ts', 'utf8');
    if (maps.indexOf(`id: '${tag}'`) !== -1) {
        console.log(`Map with tag ${tag} already exists`);
        return;
    }

    // Insert new map
    let lines = maps.split('\n');
    lines.splice(lines.length - 2, 0, map);

    file.writeFileSync('data/customMaps/_spots.ts', lines.join('\n'), 'utf8');
    console.log(`Map ${tag} created`);
};

main();
