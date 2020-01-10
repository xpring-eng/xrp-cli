module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',                      // Disable ESLint rules that would conflict with prettier
        'plugin:prettier/recommended',                      // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    parserOptions: {
        ecmaVersion: 2019,                                  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',                               // Allows for the use of imports
    },
    rules: {
        '@typescript-eslint/camelcase': 'off',              // I prefer snake_case variable names
        'no-console': 'off',                                // It's a CLI, we need to log to the console
        '@typescript-eslint/no-use-before-define': 'off',   // It's nice to define helpers at the bottom of a file.
    }
};
