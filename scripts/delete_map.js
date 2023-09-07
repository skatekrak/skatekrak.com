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
 */
const main = () => {
    const tag = getParam('--tag');

    let maps = JSON.parse(file.readFileSync('data/customMaps/_spots.json', 'utf8'));
    maps = maps.filter((map) => map.id !== tag);
    file.writeFileSync('data/customMaps/_spots.json', JSON.stringify(maps, undefined, 2), 'utf8');
    console.log(`Map ${tag} deleted`);
};

main();
