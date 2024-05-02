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
        videos = videos.split(',').map((url) => url.trim());
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

    const maps = JSON.parse(file.readFileSync('apps/api/src/data/customMaps/_spots.json', 'utf8'));

    for (const map of maps) {
        if (map.id === tag) {
            console.log(`Map with tag ${tag} already exists`);
            return;
        }
    }

    maps.push(newMap);

    file.writeFileSync('apps/api/src/data/customMaps/_spots.json', JSON.stringify(maps, undefined, 2), 'utf8');
    console.log(`Map ${tag} created`);
};

main();
