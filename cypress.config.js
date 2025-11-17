const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.gov.il',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    
    // Fixed timeout settings for slow loading pages
    defaultCommandTimeout: 30000,  // 30 seconds
    requestTimeout: 60000,         // 1 minute
    responseTimeout: 60000,        // 1 minute
    pageLoadTimeout: 300000,       // 5 minutes for very slow pages
    
    // Security settings to fix cross-origin issues
    chromeWebSecurity: false,      // Disable Chrome web security
    modifyObstructiveThirdPartyCode: true,  // Fix third party issues
    blockHosts: [],                // Don't block any hosts
    experimentalSessionAndOrigin: true,  // Enable session support
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          // Add Chrome flags to bypass security
          launchOptions.args.push('--disable-web-security')
          launchOptions.args.push('--disable-features=VizDisplayCompositor')
          launchOptions.args.push('--disable-site-isolation-trials')
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--no-sandbox')
          return launchOptions
        }
      })
    },
  },
})
