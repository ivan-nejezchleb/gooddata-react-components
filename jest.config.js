// (C) 2019 GoodData Corporation
console.log(process.env.NODE_ICU_DATA);

process.env = Object.assign(process.env, { NODE_ICU_DATA: 'node_modules/full-icu' });
const icu = require('full-icu');

console.log(icu.nodever, icu.icudat, icu.noi18n);

module.exports = {
    "setupFilesAfterEnv": [
        "<rootDir>/jest.setup.ts"
    ],
    "transform": {
        ".(js|jsx)": "babel-jest",
        ".(ts|tsx)": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(tsx?|jsx?)$",
    "testPathIgnorePatterns": [
        ",/node_modules/",
        "/dist/"
    ],
    "collectCoverageFrom": [
        "src/**/*.{ts,tsx}",
        "examples/server/src/**/*.{js,jsx}",
        "!**/*.d.ts"
    ],
    "collectCoverage": false,
    "moduleNameMapper": {
        "^[./a-zA-Z0-9$_-]+\\.svg$": "<rootDir>/jestSvgStub.js",
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.ts"
    },
    "coverageReporters": [
        "html"
    ],
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json"
    ]
};
