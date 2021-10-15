const { isCI } = require("ci-info");

const args = process.argv;
let genDir = null;
let ruleDir = null;

const GEN_DIR_TOKEN = "--gen_dir=";
const RULE_DIR_TOKEN = "--rule_dir=";

const parseArg = (token, arg, map) => {
  if (arg.startsWith(token)) {
    map.set(token, arg.split(token)[1]);
  }
};

const argMap = new Map();

for (const arg of args) {
  parseArg(GEN_DIR_TOKEN, arg, argMap);
  parseArg(RULE_DIR_TOKEN, arg, argMap);

  if (genDir != null && ruleDir != null) {
    break;
  }
}

const workspacePath = argMap
  .get(RULE_DIR_TOKEN)
  .split(argMap.get(GEN_DIR_TOKEN))[1]
  .slice(1);

const IS_WEB = process.env.TEST_ENVIRONMENT === "web";
const IS_E2E_ENABLED = process.env.E2E_ENABLED === "true";

const nodeConfig = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  coverageProvider: "v8",
  rootDir: workspacePath,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!**/coverage/**"],
  reporters: ["default"],
  coverageReporters: ["lcov", ...(!isCI ? ["text"] : [])],
  ...(IS_E2E_ENABLED
    ? {
        globalSetup: `<rootDir>/e2e/setup.ts`,
        globalTeardown: `<rootDir>/e2e/teardown.ts`,
      }
    : {}),
};

module.exports = {
  reporters: ["default"],
  haste: {
    enableSymlinks: true,
  },
  moduleNameMapper: {
    "^~/(.*)": `<rootDir>/${workspacePath}/src/$1`,
  },
  ...nodeConfig,
};
