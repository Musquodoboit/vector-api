import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        ignores: ["dist/*"],
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
        },

        settings: {
            ecmascript: 7,
        },

        rules: {
            quotes: ["error", "double"],
            "comma-style": ["error", "last"],
            "brace-style": ["warn", "1tbs"],
            "func-call-spacing": ["warn", "never"],
            "comma-dangle": ["warn", "only-multiline"],

            "comma-spacing": [
                "warn",
                {
                    before: false,
                    after: true,
                },
            ],

            "spaced-comment": [
                "warn",
                "always",
                {
                    markers: ["/"],
                },
            ],

            "semi-spacing": [
                "warn",
                {
                    before: false,
                    after: true,
                },
            ],

            "multiline-comment-style": ["warn", "separate-lines"],
            "no-label-var": "warn",
            "no-useless-rename": "warn",
            "new-cap": "warn",

            camelcase: [
                "warn",
                {
                    ignoreImports: true,
                },
            ],

            "no-unused-vars": "off",
            "object-property-newline": "off",
            eqeqeq: ["error", "always"],
            semi: ["error", "always"],
            "no-var": "error",
            strict: ["error", "global"],
            "no-confusing-arrow": "error",
            "no-shadow": ["off"],
            "@typescript-eslint/strict-boolean-expressions": "off",
            "@typescript-eslint/no-empty-function": "off",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["examples/*"],

        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",

            parserOptions: {
                project: "tsconfig.json",
            },
        },
    },
];
