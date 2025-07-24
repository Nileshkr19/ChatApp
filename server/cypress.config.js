import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5000",
    setupNodeEvents(on, config) {},
    video: false,
    screenshotOnRunFailure: false,
    supportFile: "cypress/support/e2e.js",
  },
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
});
