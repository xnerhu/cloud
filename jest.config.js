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
  .split(argMap.get(GEN_DIR_TOKEN))[1];

const IS_WEB = process.env.TEST_ENVIRONMENT === "web";

const webConfig = {
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  setupFilesAfterEnv: [`<rootDir>/${workspacePath}/src/setup-tests.ts`],
};

const nodeConfig = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
};

module.exports = {
  reporters: ["default"],
  haste: {
    enableSymlinks: true,
  },
  moduleNameMapper: {
    "^~/(.*)": `<rootDir>/${workspacePath}/src/$1`,
  },
  ...(IS_WEB ? webConfig : nodeConfig),
};
