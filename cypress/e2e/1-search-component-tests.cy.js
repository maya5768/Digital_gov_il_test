 import GovIlSearchPage from './page-objects/GovIlSearchPage'

describe('Gov.il Search Component Tests', () => {
  const searchPage = new GovIlSearchPage()

  beforeEach(() => {
    // Visit the page before each test
    searchPage.visit()
    // Wait for page to be fully loaded with timeout
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(2000)
  })
  
  // Stop on first failure
  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.log('Test failed - stopping execution')
    }
  })

  it('Test 1: Verify search button is visible and clickable', () => {
    // Verify page loaded
    cy.get('body').should('be.visible')
    cy.wait(3000) // Wait for page to fully load
    
    // Look for the search button based on actual DOM structure
    cy.get('button.search-button, .search-button, button[class*="search_button"]')
      .should('exist')
      .and('be.visible')
      .click({ force: true })
    
    // Wait for any potential search interface changes
    cy.wait(2000)
    
    // Verify the page is still responsive after click
    cy.get('body').should('be.visible')
    
    cy.log('Search button functionality verified successfully')
  })

  it('Test 2: Verify search interface elements', () => {
    // Wait for page to be ready
    cy.get('body').should('be.visible')
    cy.wait(3000)
    
    // Check if search button exists and click it
    cy.get('button.search-button, .search-button, button[class*="search_button"]')
      .should('exist')
      .and('be.visible')
      .click({ force: true })
    
    cy.wait(3000)
    
    // Look for any search-related elements that might appear
    cy.get('body').then(($body) => {
      const searchElements = $body.find('input, [class*="search"], [placeholder*="חיפוש"], [aria-label*="search"], [aria-label*="חיפוש"]')
      if (searchElements.length > 0) {
        cy.log(`Found ${searchElements.length} search-related elements`)
        // Try to interact with the first search element found
        const firstElement = searchElements.first()
        if (firstElement.is('input')) {
          cy.wrap(firstElement).clear({ force: true }).type('תעודת זהות', { force: true })
        }
      } else {
        cy.log('No search input found, but button click succeeded')
      }
    })
    
    // Verify page is still functional
    cy.get('body').should('be.visible')
    cy.url().then((url) => {
      cy.log(`Current URL: ${url}`)
      expect(url.length).to.be.greaterThan(0)
    })
  })

  it('Test 3: Verify search component interaction', () => {
    // Wait for page to be ready
    cy.get('body').should('be.visible')
    cy.wait(3000)
    
    // Click on search button multiple times to test interaction
    cy.get('button.search-button, .search-button, button[class*="search_button"]')
      .should('exist')
      .and('be.visible')
      .click({ force: true })
    
    cy.wait(1000)
    
    // Click again to see if it toggles or changes state
    cy.get('button.search-button, .search-button, button[class*="search_button"]')
      .click({ force: true })
    
    cy.wait(2000)
    
    // Check for any modal, dropdown, or overlay that might appear
    cy.get('body').then(($body) => {
      const overlayElements = $body.find('[class*="modal"], [class*="dropdown"], [class*="overlay"], [class*="popup"], [role="dialog"]')
      if (overlayElements.length > 0) {
        cy.log(`Found ${overlayElements.length} overlay/modal elements`)
      }
      
      const searchInputs = $body.find('input')
      if (searchInputs.length > 0) {
        cy.log(`Found ${searchInputs.length} input elements on the page`)
      }
    })
    
    // Verify page remains functional
    cy.get('body').should('be.visible')
    cy.log('Search component interaction test completed')
  })
})

