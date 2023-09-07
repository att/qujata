import { defineConfig } from "cypress";

export default defineConfig({
  fixturesFolder: './cypress/fixtures',
  supportFolder:'./cypress/support',
  reporter: 'cypress-multi-reporters',
  screenshotsFolder: './reports/screenshots',
  video: true,
  videosFolder: './reports/videos',
  videoUploadOnPasses: false,
  viewportHeight: 660,
  viewportWidth: 1000,
  reporterOptions: {
    configFile: './reporters-config/config.json'
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 4000,
  env: {
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://google.com',

  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },

  },
});
