
module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:prettier/recommended', // Integrates Prettier with ESLint
    ],
    parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
        jsx: true, // Allows for the parsing of JSX
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React to use
      },
    },
    rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          // Place to specify TypeScript-specific rules
          // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        },
      },
    ],
  };