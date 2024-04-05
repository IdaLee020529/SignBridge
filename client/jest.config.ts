// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["node_modules", "coverage"],
  collectCoverageFrom: [
    "./src/**/*.{ts,tsx,js,jsx}", // Include all TypeScript/TSX files under src
    "!./src/tests/**", // Exclude test files
    "!**/node_modules/**", // Exclude files in node_modules,
    "!*.json",
    "!*.{ts,tsx}",
    "!./src/services/**",
    "!./src/constants/**",
  ],
  testResultsProcessor: "jest-junit",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(some-library)/)",
    "^.+\\.module\\.(css)$",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "\\.(css)$": "identity-obj-proxy",
    "@root/(.*)": ["<rootDir>/src/$1"],
  },
  coverageReporters: ["lcov", "cobertura", "html"],
  coverageDirectory: "<rootDir>/coverage",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
