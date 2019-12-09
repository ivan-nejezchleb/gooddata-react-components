// (C) 2019 GoodData Corporation
console.log(process.env.NODE_ICU_DATA);

// process.env = Object.assign(process.env, { NODE_ICU_DATA: 'node_modules/full-icu' });
// const icu = require('full-icu');

// console.log(icu.nodever, icu.icudat, icu.noi18n);

const jestConfig = require('./jest.config.js');

const config = {
    ...jestConfig,
    "collectCoverage": true,
    "coverageDirectory": "<rootDir>/ci/results/coverage",
    "coverageReporters": ["json", "cobertura", "lcov"],
    "testResultsProcessor": "<rootDir>/node_modules/jest-junit"
};

module.exports = config;
