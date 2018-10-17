exports.config = {
    files: {
        stylesheets: {
            joinTo: 'css/app.css',
            order: {
                before: 'app/styles/reset.css',
            },
        },
        javascripts: {
            joinTo: 'js/app.js',
        },
    },
    plugins: {
        autoReload: {
            port: 9485,
        },
        stylus: {
            plugins: [require('autoprefixer-stylus')({ browsers: ['last 2 version', '> 1%'] })],
        },
    },
    modules: {
        autoRequire: {
            'js/app.js': ['js/main'],
        },
    },
};
