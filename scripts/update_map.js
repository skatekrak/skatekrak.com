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
 * node update_map.js \
 *  --tag <tag> \
 *  --name <name> \
 *  --category <category> \
 *  --subtitle <subtitle> \
 *  --edito <edito> \
 *  --about <about> \
 *  --videos <videos>
 */
const main = () => {
    const tag = getParam('--tag');
    const name = getParam('--name');
    const category = getParam('--category');
    const subtitle = getParam('--subtitle');
    const edito = getParam('--edito');
    const about = getParam('--about');
    let videos = getParam('--videos');

    if (videos !== '') {
        videos = videos.split(',');
    } else {
        videos = [];
    }

    const newMap = {
        id: tag,
        categories: [category],
        name,
        subtitle,
        edito,
        about,
        videos,
    };

    // Delete keys
    for (const key in newMap) {
        if (newMap[key] === '') {
            delete newMap[key];
        }
    }

    const maps = JSON.parse(file.readFileSync('data/customMaps/_spots.json', 'utf8'));

    for (let i = 0; i < maps.length; i++) {
        if (maps[i].id === tag) {
            maps[i] = { ...maps[i], ...newMap };
            file.writeFileSync('data/customMaps/_spots.json', JSON.stringify(maps, undefined, 2), 'utf8');
            console.log(`Map ${tag} updated`);
            return;
        }
    }

    console.log('Map not found');
};

main();
