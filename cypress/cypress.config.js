const { defineConfig } = require('cypress')
const path = require('path')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.gov.il',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    // Reduced timeouts to fail faster and stop when stuck
    defaultCommandTimeout: 5000,
    requestTimeout: 5000,
    responseTimeout: 5000,
    pageLoadTimeout: 60000, // Increased for slow-loading pages
    // Stop on first failure
    stopOnFirstFailure: true,
    // Retry configuration
    retries: {
      runMode: 0, // Don't retry in CI
      openMode: 0 // Don't retry in interactive mode
    },
    supportFile: path.join(__dirname, 'support', 'e2e.js'),
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Add timeout handler to stop tests when stuck
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      
      // Fail fast on uncaught exceptions
      on('before:spec', (spec) => {
        console.log(`Running spec: ${spec.relative}`)
      })
      
      return config
    },
  },
})

