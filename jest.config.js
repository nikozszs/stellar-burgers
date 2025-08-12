/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@api$': '<rootDir>/src/utils/burger-api.ts',
        '^@utils-types$': '<rootDir>/src/utils/types',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
        pageTitle: "Отчёт по тестированию",
        outputPath: "public/index.html",
        boilerplate: "test-report/index.html"
        }]
    ],
    testEnvironment: "jsdom"
};