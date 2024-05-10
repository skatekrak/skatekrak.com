module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended', // Enable eslint-plugin-prettier and eslint-config-prettier
    ],
    rules: {
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/ban-types': 'off',
    },
};
