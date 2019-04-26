module.exports = (api) => {
    api.cache(true);

    const presets = ['next/babel', ['@zeit/next-typescript/babel', { allExtensions: true, isTSX: true }]];

    const plugins = [
        [
            'module-resolver',
            {
                alias: {
                    components: './components',
                    hocs: './hocs',
                    lib: './lib',
                    pages: './pages',
                    saga: './saga',
                    store: './store',
                },
                root: '.',
            },
        ],
    ];

    return {
        plugins,
        presets,
    };
};
