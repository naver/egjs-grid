// Set e2e config
process.env.TS_NODE_PROJECT = "./test/e2e/tsconfig.json";
require('ts-node/register')
// Restore config
process.env.TS_NODE_PROJECT = "";

const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
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
      screenshotFolder: "./test/e2e/log/output/",
      baseFolder: "./test/e2e/log/",
      diffFolder: "./test/e2e/log/diff/"
    }
  },
  async bootstrap() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 60000);
    });
  },
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
