process.env.TS_NODE_PROJECT = "./test/e2e/tsconfig.json";
require('ts-node/register')
const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './test/e2e/**/*.e2e.ts',
  output: './test/e2e/log',
  helpers: {
    Playwright: {
      url: 'http://localhost:6005',
      show: true,
      browser: 'chromium'
    },
    StorybookHelper: {
      require: './test/e2e/helper/StorybookHelper'
    },
    ResembleHelper: {
      require: "codeceptjs-resemblehelper",
      screenshotFolder : "./test/e2e/log/output/",
      baseFolder: "./test/e2e/log/",
      diffFolder: "./test/e2e/log/diff/"
    }
  },
  bootstrap: null,
  mocha: {},
  name: 'egjs-flicking',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}
