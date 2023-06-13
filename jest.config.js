module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: ["<rootDir>/.dist"],
    globalSetup: "./scripts/jest-global-setup.ts",
    // moduleNameMapper: {
    //     "@exmpl/(.*)": "<rootDir>/src/$1",
    // },
};
