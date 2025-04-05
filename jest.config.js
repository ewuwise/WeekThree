module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Use Babel to transform JavaScript files
    },
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy', // Mock CSS imports
    },
    testEnvironment: 'jsdom', // Use jsdom for testing React components
    transformIgnorePatterns: [
        "/node_modules/(?!@testing-library/react|@testing-library/jest-dom)" // Allow transformation of specific node_modules
    ],
};
