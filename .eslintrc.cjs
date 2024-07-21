module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        'no-console': ['error'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': 'off',
        'max-len': ['error', { code: 140 }],
        'object-curly-newline': ['error', {
            ObjectExpression: {
                multiline: true,
                minProperties: 6,
            },
            ObjectPattern: {
                multiline: true,
                minProperties: 6,
            },
        }],
        'max-classes-per-file': ['error', 5],
        'padded-blocks': ['error', { classes: 'always' }],
        'import/no-unresolved': 'off',
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': 'off',
        'react/jsx-filename-extension': 'off',
        'react/prefer-stateless-function': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
    },
};
