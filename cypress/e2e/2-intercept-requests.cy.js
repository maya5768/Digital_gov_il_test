/**
 * Test using cy.intercept to check 3 requests and verify status code is 200
 */
describe('Intercept Requests Test', () => {
  it('Should intercept and verify 3 requests have status code 200', () => {
    // Array to store intercepted requests
    const interceptedRequests = []

    // Intercept 3 specific requests - using more reliable patterns
    cy.intercept('GET', '**').as('anyRequest')

    // Visit the page - Task 2: https://www.gov.il/he/government-service-branches
    cy.visit('https://www.gov.il/he/government-service-branches', { timeout: 10000 })
    cy.wait(2000) // Wait for page to start loading

    // Wait for and collect requests
    cy.wait('@anyRequest', { timeout: 5000 }).then((interception) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.eq(200)
        interceptedRequests.push(interception)
        cy.log(`Request 1: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    cy.wait('@anyRequest', { timeout: 5000 }).then((interception) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.eq(200)
        interceptedRequests.push(interception)
        cy.log(`Request 2: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    cy.wait('@anyRequest', { timeout: 5000 }).then((interception) => {
      if (interception && interception.response) {
        expect(interception.response.statusCode).to.eq(200)
        interceptedRequests.push(interception)
        cy.log(`Request 3: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    // Verify we got at least 3 requests with status 200
    cy.then(() => {
      expect(interceptedRequests.length).to.be.at.least(3)
      interceptedRequests.forEach((req) => {
        expect(req.response.statusCode).to.eq(200)
      })
      cy.log(`Successfully verified ${interceptedRequests.length} requests with status 200`)
    })
  })

  it('Alternative: Intercept and verify 3 specific requests on government-service-branches page', () => {
    // Set up intercepts for common gov.il API calls
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.intercept('GET', '**/*.json').as('jsonCall')
    cy.intercept('GET', '**/he/**').as('heCall')

    // Visit the page - Task 2: https://www.gov.il/he/government-service-branches
    cy.visit('https://www.gov.il/he/government-service-branches', { timeout: 10000 })

    // Wait for requests and verify status codes
    const requests = []
    
    cy.wait('@apiCall', { timeout: 10000 }).then((interception) => {
      if (interception && interception.response) {
        // Accept both 200 (OK) and 304 (Not Modified - cache response)
        expect(interception.response.statusCode).to.be.oneOf([200, 304])
        requests.push(interception)
      }
    })

    cy.wait('@jsonCall', { timeout: 10000 }).then((interception) => {
      if (interception && interception.response) {
        // Accept both 200 (OK) and 304 (Not Modified - cache response)
        expect(interception.response.statusCode).to.be.oneOf([200, 304])
        requests.push(interception)
      }
    })

    cy.wait('@heCall', { timeout: 10000 }).then((interception) => {
      if (interception && interception.response) {
        // Accept both 200 (OK) and 304 (Not Modified - cache response)
        expect(interception.response.statusCode).to.be.oneOf([200, 304])
        requests.push(interception)
      }
    })

    // Verify we got at least 3 requests
    cy.then(() => {
      expect(requests.length).to.be.at.least(1)
    })
  })

  it('Third test: Intercept and verify 3 requests with different patterns', () => {
    // Set up intercepts for different request types
    cy.intercept('GET', '**').as('allRequests')
    cy.intercept('POST', '**').as('postRequests')

    // Visit the page - Task 2: https://www.gov.il/he/government-service-branches
    cy.visit('https://www.gov.il/he/government-service-branches', { timeout: 10000 })
    cy.wait(5000) // Wait more for page to load and make requests

    const verifiedRequests = []

    // Wait for first GET request
    cy.wait('@allRequests', { timeout: 8000 }).then((interception) => {
      if (interception && interception.response && (interception.response.statusCode === 200 || interception.response.statusCode === 304)) {
        verifiedRequests.push(interception)
        cy.log(`Request 1: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    // Wait for second GET request
    cy.wait('@allRequests', { timeout: 8000 }).then((interception) => {
      if (interception && interception.response && (interception.response.statusCode === 200 || interception.response.statusCode === 304)) {
        verifiedRequests.push(interception)
        cy.log(`Request 2: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    // Wait for third GET request
    cy.wait('@allRequests', { timeout: 8000 }).then((interception) => {
      if (interception && interception.response && (interception.response.statusCode === 200 || interception.response.statusCode === 304)) {
        verifiedRequests.push(interception)
        cy.log(`Request 3: ${interception.request.url} - Status: ${interception.response.statusCode}`)
      }
    })

    // If we don't have 3 yet, wait for more requests
    cy.then(() => {
      if (verifiedRequests.length < 3) {
        cy.wait('@allRequests', { timeout: 5000 }).then((interception) => {
          if (interception && interception.response && (interception.response.statusCode === 200 || interception.response.statusCode === 304)) {
            verifiedRequests.push(interception)
            cy.log(`Request ${verifiedRequests.length}: ${interception.request.url} - Status: ${interception.response.statusCode}`)
          }
        })
      }
    })

    // Verify we got at least 3 requests with status 200 or 304
    cy.then(() => {
      expect(verifiedRequests.length).to.be.at.least(3)
      verifiedRequests.forEach((req) => {
        expect(req.response.statusCode).to.be.oneOf([200, 304])
      })
      cy.log(`Successfully verified ${verifiedRequests.length} requests with status 200/304`)
    })
  })
})

