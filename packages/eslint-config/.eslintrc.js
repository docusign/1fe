module.exports = {
  // Extend base configurations
  extends: [
    'eslint:recommended', // Base ESLint recommended rules
    'plugin:react/recommended', // React-specific rules (if using React)
    'plugin:@typescript-eslint/recommended', // TypeScript-specific rules (if using TypeScript)
    'plugin:prettier/recommended', // Prettier configuration (this ensures Prettier rules are enabled)
    'eslint-config-prettier', // Turns off conflicting ESLint rules that are handled by Prettier
  ],
  parser: '@typescript-eslint/parser', // Use the TypeScript parser (if applicable)
  parserOptions: {
    ecmaVersion: 2021, // Support the latest ECMAScript features
    sourceType: 'module', // Enable ECMAScript modules
  },
  plugins: [
    '@typescript-eslint', // TypeScript plugin (if using TypeScript)
    'prettier', // Prettier plugin
  ],
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable Node.js global variables
    es6: true, // Enable ECMAScript 6 features
  },
  rules: {
    'prettier/prettier': 'error', // Treat Prettier violations as errors
    'react/react-in-jsx-scope': 'off', // If using React 17+ with JSX transform
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: Disables enforcing explicit return types on function signatures
    '@typescript-eslint/no-explicit-any': 'off', // Optional: Disables restrictions on `any` type (useful for some use cases)
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'no-control-regex': 'off',
    'no-global-assign': 'off',
    'no-empty': 'off',
    'react/no-unknown-property': 'off', // ts handles this
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
