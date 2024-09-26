const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.js',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};

// Next.js custom Jest config as the svg is transformed in a specific way (This really hard to find solution, Yayy!)
const jestConfigWithOverrides = async (...args) => {
  const configFn = createJestConfig(customJestConfig);
  const res = await configFn(...args);

  res.moduleNameMapper = {
    // we cannot depend on the exact key used by Next.js
    // so we inject an SVG key higher up on the mapping tree
    "\\.svg": "<rootDir>/src/__mocks__/svgrMock.js",
    ...res.moduleNameMapper,
  };

  return res;
};

module.exports = jestConfigWithOverrides;