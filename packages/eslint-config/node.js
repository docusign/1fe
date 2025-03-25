/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "unused-imports", "import"],
    overrides: [
      {
        files: ["*.js"],
        extends: ["plugin:@typescript-eslint/disable-type-checked"],
      },
      {
        files: ["*test.ts"],
        rules: {
          "@typescript-eslint/require-await": "off",
          "@typescript-eslint/no-unused-vars": "off",
        },
      },
    ],
    rules: {
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      "prettier/prettier": "warn",
      "unused-imports/no-unused-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-interface": "off",
      "no-console": "warn",
      "no-duplicate-imports": "warn",
      "import/newline-after-import": [
        "error",
        {
          count: 1,
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
        },
      ],
      "lines-between-class-members": [
        "warn",
        "always",
        {
          exceptAfterSingleLine: true,
        },
      ],
    },
  };