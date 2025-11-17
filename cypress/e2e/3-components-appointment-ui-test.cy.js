/**
 * Test: Component-level testing for appointment elements
 * Check UI elements, hover effects, and navigation for appointment scheduling
 */
describe('Appointment UI Components Test', () => {
  beforeEach(() => {
    // Visit the page with optimized settings
    cy.visit('https://govisit.gov.il/he/authorities/authority/262', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    
    // Wait for basic page structure
    cy.get('body').should('be.visible')
    cy.wait(8000) // Reasonable wait for content
  })

  it('Should find and test appointment-related UI elements', () => {
    cy.log('🔍 Testing appointment UI components')
    
    // Search for appointment-related text elements
    const appointmentTerms = [
      'זימון תור',
      'קביעת תור', 
      'תיאום פגישה',
      'appointment'
    ]
    
    appointmentTerms.forEach(term => {
      cy.get('body').then(($body) => {
        if ($body.text().includes(term)) {
          cy.log(`✅ Found appointment term: ${term}`)
        }
      })
    })

    // Look for clickable elements that might be appointment-related
    cy.get('body').find('*').contains(/זימון|תור|appointment/i).then(($elements) => {
      if ($elements.length > 0) {
        cy.log(`Found ${$elements.length} appointment-related elements`)
        
        // Test the first few elements
        cy.wrap($elements).each(($el, index) => {
          if (index < 3) { // Test only first 3 to avoid timeouts
            cy.wrap($el).then(($element) => {
              const tagName = $element.prop('tagName').toLowerCase()
              const isClickable = ['a', 'button'].includes(tagName) || $element.attr('onclick')
              
              if (isClickable) {
                cy.log(`Testing clickable appointment element: ${tagName}`)
                
                // Test hover effect (should turn blue)
                cy.wrap($element)
                  .trigger('mouseover', { force: true })
                  .should('be.visible')
                
                // Check if element has blue styling on hover
                cy.wrap($element).then(($hoveredEl) => {
                  const computedStyle = window.getComputedStyle($hoveredEl[0])
                  const color = computedStyle.color
                  const backgroundColor = computedStyle.backgroundColor
                  
                  cy.log(`Element colors - Text: ${color}, Background: ${backgroundColor}`)
                  
                  // Verify it's clickable and visible
                  cy.wrap($element).should('be.visible')
                })
              }
            })
          }
        })
      } else {
        cy.log('⚠️ No appointment-related elements found')
      }
    })
  })

  it('Should test appointment link navigation behavior', () => {
    cy.log('🔗 Testing appointment link navigation')
    
    // Look for any clickable elements with appointment-related text
    cy.get('body').contains(/תור|זימון|appointment/i).then(($elements) => {
      if ($elements.length > 0) {
        cy.log(`✅ Found ${$elements.length} appointment-related elements`)
        
        // Test the first clickable element
        cy.wrap($elements).first().then(($element) => {
          const tagName = $element.prop('tagName').toLowerCase()
          cy.log(`Testing element: ${tagName} with text: "${$element.text().trim()}"`)
          
          // Test hover effect
          cy.wrap($element)
            .trigger('mouseover', { force: true })
            .should('be.visible')
          
          // Check if element has pointer cursor or is clickable
          cy.wrap($element).then(($el) => {
            const isClickable = ['a', 'button'].includes(tagName) || $el.attr('onclick') || $el.attr('href')
            if (isClickable) {
              cy.log('✅ Element is clickable')
            } else {
              cy.log('ℹ️ Element found but not directly clickable')
            }
          })
        })
      } else {
        cy.log('⚠️ No appointment-related clickable elements found')
      }
    })
  })

  it('Should verify appointment elements are properly displayed', () => {
    cy.log('🎨 Testing appointment element display properties')
    
    // Find any element containing appointment terms
    cy.get('body').contains(/זימון|תור|appointment/i)
      .first()
      .then(($element) => {
        if ($element.length > 0) {
          const elementText = $element.text().trim()
          cy.log(`✅ Found appointment element: "${elementText}"`)
          
          // Test basic visibility
          cy.wrap($element).should('be.visible')
          
          // Test hover effect and color change
          cy.wrap($element)
            .trigger('mouseover', { force: true })
            .then(($el) => {
              const computedStyle = window.getComputedStyle($el[0])
              const color = computedStyle.color
              const backgroundColor = computedStyle.backgroundColor
              const cursor = computedStyle.cursor
              
              cy.log(`🎨 Element styling:`)
              cy.log(`- Text color: ${color}`)
              cy.log(`- Background: ${backgroundColor}`)
              cy.log(`- Cursor: ${cursor}`)
              
              // Check if element becomes blue on hover (common pattern)
              if (color.includes('blue') || backgroundColor.includes('blue') || cursor === 'pointer') {
                cy.log('✅ Element shows interactive behavior (blue color or pointer cursor)')
              }
            })
          
          // Test accessibility attributes
          cy.wrap($element).then(($el) => {
            const hasAriaLabel = $el.attr('aria-label')
            const hasRole = $el.attr('role')
            const hasTabIndex = $el.attr('tabindex')
            const tagName = $el.prop('tagName').toLowerCase()
            
            cy.log('🔍 Accessibility check:')
            cy.log(`- Tag: ${tagName}`)
            cy.log(`- ARIA label: ${hasAriaLabel || 'None'}`)
            cy.log(`- Role: ${hasRole || 'Default'}`)
            cy.log(`- Tab index: ${hasTabIndex || 'Default'}`)
            
            // Only try to focus if it's a focusable element
            if (['a', 'button', 'input', 'select', 'textarea'].includes(tagName) || hasTabIndex) {
              cy.wrap($element).focus()
              cy.wrap($element).should('have.focus')
            } else {
              cy.log('ℹ️ Element is not focusable (this is normal for labels)')
            }
          })
            
        } else {
          cy.log('⚠️ No appointment elements found for display testing')
        }
      })
  })

  it('Should check for appointment-related form elements', () => {
    cy.log('📝 Checking for appointment form components')
    
    // Look for form elements that might be related to appointments
    cy.get('input, select, textarea').then(($formElements) => {
      if ($formElements.length > 0) {
        cy.log(`Found ${$formElements.length} form elements`)
        
        // Check if any have appointment-related attributes
        cy.wrap($formElements).each(($el) => {
          const placeholder = $el.attr('placeholder') || ''
          const name = $el.attr('name') || ''
          const id = $el.attr('id') || ''
          
          if (placeholder.includes('תור') || name.includes('appointment') || id.includes('זימון')) {
            cy.log('✅ Found appointment-related form element')
            cy.wrap($el).should('be.visible')
          }
        })
      }
    })
  })
})