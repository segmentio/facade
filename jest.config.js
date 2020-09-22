module.exports = {
  // preset: "ts-jest",
  transform: { "\\.ts$": ["ts-jest"], "\\.js$": ["ts-jest"] },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  clearMocks: true,
  moduleNameMapper: {
    "@/(.+)": "<rootdir>/../../src/$1",
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};
