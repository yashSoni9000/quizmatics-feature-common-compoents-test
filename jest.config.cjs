module.exports = {
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "<rootDir>/"],
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy",
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@images/(.*)$": "<rootDir>/src/assets/images/$1",
        "^@assets/(.*)$": "<rootDir>/src/assets/$1",
        "^@components/(.*)$": "<rootDir>/src/components/$1",
        "^@constants/(.*)$": "<rootDir>/src/constants/$1",
        "^@context/(.*)$": "<rootDir>/src/context/$1",
        "^@layout/(.*)$": "<rootDir>/src/layout/$1",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@style/(.*)$": "<rootDir>/src/style/$1",
        "^@pages/(.*)$": "<rootDir>/src/pages/$1",
        "^@themes/(.*)$": "<rootDir>/src/themes/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    },
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/fileTransformer.cjs',
    },
    collectCoverage: false,
    collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}", "!<rootDir>/src/themes/*.ts", "!<rootDir>/src/constants/*.{ts,tsx}", "!<rootDir>/src/**/*.d.ts", "!<rootDir>/src/constants/*.test.*"],

}