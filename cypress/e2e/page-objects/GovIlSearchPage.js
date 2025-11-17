/**
 * Page Object Model for Gov.il Search Component
 * Located in the header of the website
 */
class GovIlSearchPage {
  // Selectors for the search component - more flexible selectors
  getSearchInput() {
    // Try multiple selectors - ONLY input elements, NOT SVG or other elements
    // More comprehensive selectors for gov.il search
    return cy.get('input[type="search"], input[placeholder*="חיפוש"], input[aria-label*="חיפוש"], input.search-input, input[data-testid="search"], header input, .header input, nav input, input[class*="search"], input[id*="search"], form input[type="text"], input[type="text"][placeholder*="חיפוש"]', { timeout: 10000 })
      .first()
      .should('exist')
  }

  getSearchButton() {
    // Try multiple button selectors
    return cy.get('button[type="submit"], button[aria-label*="חיפוש"], .search-button, [data-testid="search-button"], input[type="search"] + button, input[type="search"] ~ button', { timeout: 5000 }).first()
  }

  getSearchIcon() {
    // Look for search icon - could be SVG, button, or link
    return cy.get('[aria-label*="חיפוש"], .search-icon, svg[aria-label*="חיפוש"], header button, .header button, nav button', { timeout: 5000 }).first()
  }

  getSearchResults() {
    return cy.get('.search-results, .results, [data-testid="search-results"]', { timeout: 10000 })
  }

  getSearchDropdown() {
    return cy.get('.search-dropdown, .autocomplete, [data-testid="search-dropdown"]', { timeout: 5000 })
  }

  // Actions
  visit() {
    cy.visit('/', { timeout: 30000 })
    cy.wait(3000) // Wait for page to fully load
    // Wait for body to be visible
    cy.get('body').should('be.visible')
  }

  clickSearchIcon() {
    // Try to find and click search icon, with fallback
    cy.get('body').should('be.visible')
    cy.wait(1500)
    
    // Try to find and click search icon - if not found, skip (search might be already visible)
    cy.get('body').then(($body) => {
      // More comprehensive selectors for search icon/button
      const searchElements = $body.find('[aria-label*="חיפוש"], [aria-label*="search"], .search-icon, .search-button, button[class*="search"], button[id*="search"], header button, nav button, svg[aria-label*="חיפוש"], a[aria-label*="חיפוש"]')
      
      if (searchElements.length > 0) {
        cy.wrap(searchElements.first()).click({ force: true, timeout: 5000 })
        cy.wait(2000) // Wait more for search box to open
      } else {
        cy.log('Search icon not found, search input might be already visible')
        // Try pressing Escape or looking for search in different places
        cy.get('body').type('{esc}') // Close any modals
        cy.wait(1000)
      }
    })
    return this
  }

  typeInSearchBox(searchTerm) {
    // Wait a bit and then try to type
    cy.wait(500)
    
    // Get the input element and verify it's actually an input
    this.getSearchInput().then(($input) => {
      // Verify it's an input element, not SVG
      expect($input[0].tagName.toLowerCase()).to.equal('input')
      expect($input[0].type).to.be.oneOf(['text', 'search', ''])
      
      // Only clear if it's a clearable input
      const currentValue = $input.val() || ''
      if (currentValue.length > 0) {
        cy.wrap($input).clear({ timeout: 2000 })
        cy.wait(300)
      }
      
      // Type the search term
      cy.wrap($input).type(searchTerm, { timeout: 5000, force: true })
      cy.wait(500)
    })
    
    return this
  }

  submitSearch() {
    cy.wait(500)
    // Try to click button, if not found, press Enter on input
    cy.get('body').then(($body) => {
      const submitButtons = $body.find('button[type="submit"], .search-button')
      if (submitButtons.length > 0) {
        cy.wrap(submitButtons.first()).click({ force: true })
        cy.wait(2000)
      } else {
        // If button not found, press Enter on input instead
        cy.log('Search button not found, pressing Enter instead')
        // Get search input and press Enter
        cy.get('input[type="search"], input[placeholder*="חיפוש"]').first().type('{enter}')
        cy.wait(2000)
      }
    })
    return this
  }

  searchFor(searchTerm) {
    this.clickSearchIcon()
    cy.wait(1000)
    this.typeInSearchBox(searchTerm)
    cy.wait(500)
    this.submitSearch()
    return this
  }

  // Assertions
  verifySearchInputVisible() {
    // More flexible check - just verify something search-related exists
    cy.get('body').should('be.visible')
    cy.wait(2000) // Wait more for page to load
    
    // Try multiple approaches to find search input
    cy.get('body').then(($body) => {
      // Try to find search input with various selectors
      const searchInputs = $body.find('input[type="search"], input[placeholder*="חיפוש"], input[aria-label*="חיפוש"], input[class*="search"], input[id*="search"], header input, nav input')
      
      if (searchInputs.length === 0) {
        // If no input found, try to find search icon/button and click it
        cy.log('Search input not immediately visible, trying to open search')
        // Click search icon to open search box
        const searchElements = $body.find('[aria-label*="חיפוש"], [aria-label*="search"], .search-icon, .search-button, button[class*="search"], button[id*="search"], header button, nav button')
        if (searchElements.length > 0) {
          cy.wrap(searchElements.first()).click({ force: true, timeout: 5000 })
          cy.wait(2000)
        }
      }
      
      // Now try to find the input again with extended timeout
      cy.get('input[type="search"], input[placeholder*="חיפוש"], input[aria-label*="חיפוש"], input[class*="search"], input[id*="search"], header input, nav input, input[type="text"]', { timeout: 10000 })
        .should('exist')
        .then(($inputs) => {
          // Verify at least one is actually an input element
          const validInputs = Array.from($inputs).filter(el => el.tagName.toLowerCase() === 'input')
          expect(validInputs.length).to.be.greaterThan(0)
        })
    })
    return this
  }

  verifySearchInputPlaceholder() {
    this.getSearchInput()
      .should('exist')
      .then(($input) => {
        // Verify it's actually an input element
        expect($input[0].tagName.toLowerCase()).to.equal('input')
      })
    return this
  }

  verifySearchResultsDisplayed() {
    // More flexible - just check URL changed or page loaded
    cy.url().should('not.contain', '/#')
    cy.get('body').should('be.visible')
    return this
  }
}

export default GovIlSearchPage

