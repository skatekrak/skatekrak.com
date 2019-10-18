module.exports = api => {
    api.cache(true);

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
                    models: './models',
                },
                root: '.',
            },
        ],
    ];

    return {
        presets: ['next/babel'],
        plugins,
    };
};
