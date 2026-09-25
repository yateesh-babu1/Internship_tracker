const js = require("@eslint/js");

module.exports = [
    {
        ignores: [
            "node_modules/**",
            "public/**"
        ]
    },

    js.configs.recommended,

    {
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",

            globals: {
                process: "readonly",
                __dirname: "readonly",
                console: "readonly"
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "no-console": "off"
        }
    },

    {
        files: ["tests/**/*.js"],

        languageOptions: {
            globals: {
                describe: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly"
            }
        }
    }
];