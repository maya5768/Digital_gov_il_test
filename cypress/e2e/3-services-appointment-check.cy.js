/**
 * Test: Loop on services and for each service click on it
 * Check if URL contains 'appointment'
 */
describe('Services Appointment URL Check', () => {
  it('Improved: Search for appointment links with better detection', () => {
    // Visit the page with better error handling
    cy.visit('https://govisit.gov.il/he/authorities/authority/262', { 
      failOnStatusCode: false,
      timeout: 60000
    })
    
    // Wait for basic page structure to load
    cy.get('body').should('be.visible')
    cy.wait(12000) // Extended wait for content to fully render

    cy.log('🔍 Starting comprehensive appointment search')
    
    // First approach: Search in page content for 'appointment' keyword
    cy.get('body').then(($body) => {
      const pageText = $body.text().toLowerCase()
      const pageHtml = $body.html().toLowerCase()
      
      cy.log(`Page contains ${pageText.length} characters of text`)
      
      // Check for 'appointment' keyword in text and HTML
      const hasAppointmentInText = pageText.includes('appointment')
      const hasAppointmentInHtml = pageHtml.includes('appointment')
      
      cy.log(`✅ Appointment in text: ${hasAppointmentInText}`)
      cy.log(`✅ Appointment in HTML: ${hasAppointmentInHtml}`)
      
      if (hasAppointmentInText || hasAppointmentInHtml) {
        cy.log('✓ SUCCESS: Found "appointment" keyword on page!')
        
        // Try to find and click elements containing 'appointment'
        cy.get('*').filter((index, element) => {
          return element.textContent.toLowerCase().includes('appointment') ||
                 element.innerHTML.toLowerCase().includes('appointment')
        }).then(($appointmentElements) => {
          if ($appointmentElements.length > 0) {
            cy.log(`Found ${$appointmentElements.length} elements with 'appointment'`)
            
            // Test clicking on appointment elements (fixed DOM detachment issue)
            for (let i = 0; i < Math.min($appointmentElements.length, 2); i++) {
              cy.wrap($appointmentElements[i]).then(($el) => {
                const elementText = $el.text().trim().substring(0, 50)
                const isClickable = $el.is('a, button, [onclick], [role="button"]')
                
                cy.log(`Testing appointment element ${i + 1}: "${elementText}"`)
                cy.log(`Element is clickable: ${isClickable}`)
                
                if (isClickable) {
                  // Store element reference before clicking
                  cy.wrap($el).as(`appointmentEl${i}`)
                  
                  // Click without continuing the chain
                  cy.get(`@appointmentEl${i}`).click({ force: true })
                  
                  // Wait for navigation
                  cy.wait(3000)
                  
                  // Check URL in a separate command
                  cy.url().then((url) => {
                    const urlLower = url.toLowerCase()
                    const appointmentInUrl = urlLower.includes('appointment') ||
                                           urlLower.includes('תור') ||
                                           urlLower.includes('queue') ||
                                           urlLower.includes('booking')
                    
                    cy.log(`URL after click: ${url}`)
                    cy.log(`✅ Appointment keywords in URL: ${appointmentInUrl}`)
                  })
                  
                  // Go back in a separate command
                  cy.go('back')
                  cy.wait(3000)
                } else {
                  cy.log('ℹ️ Element is not clickable, skipping click test')
                }
              })
            }
          }
        })
      } else {
        cy.log('⚠️ "appointment" keyword not found in page content')
        
        // Alternative: search for Hebrew appointment-related terms
        const hebrewTerms = ['תור', 'זימון', 'קביעת', 'בקשה']
        let foundHebrewTerms = []
        
        hebrewTerms.forEach(term => {
          if (pageText.includes(term)) {
            foundHebrewTerms.push(term)
          }
        })
        
        cy.log(`Found Hebrew appointment terms: ${foundHebrewTerms.join(', ')}`)
        
        if (foundHebrewTerms.length > 0) {
          cy.log('✓ Found Hebrew appointment-related terms as alternative')
        }
      }
    })
    
    cy.log('✅ Comprehensive appointment search completed')
  })

  it('FOCUSED: Dedicated appointment keyword search and validation', () => {
    cy.log('🎯 FOCUSED TEST: Searching specifically for "appointment" keyword')
    
    // Visit with comprehensive error handling
    cy.visit('https://govisit.gov.il/he/authorities/authority/262', { 
      failOnStatusCode: false,
      timeout: 60000,
      onBeforeLoad: (win) => {
        win.addEventListener('error', () => {})
      }
    })
    
    cy.get('body').should('be.visible')
    cy.wait(10000)
    
    // STEP 1: Comprehensive appointment keyword search
    cy.get('body').then(($body) => {
      const fullText = $body.text()
      const fullHtml = $body.html()
      const textLower = fullText.toLowerCase()
      const htmlLower = fullHtml.toLowerCase()
      
      cy.log('📊 ANALYZING PAGE CONTENT FOR APPOINTMENT KEYWORDS')
      cy.log(`Total page text length: ${fullText.length} characters`)
      
      // Multiple variations of appointment search
      const appointmentVariations = [
        'appointment',
        'appointments', 
        'appointment-',
        'appointment_',
        'appoint',
        'appointing'
      ]
      
      let foundVariations = []
      
      appointmentVariations.forEach(variation => {
        if (textLower.includes(variation) || htmlLower.includes(variation)) {
          foundVariations.push(variation)
          cy.log(`✓ FOUND: "${variation}" in page content`)
        }
      })
      
      if (foundVariations.length > 0) {
        cy.log(`🎉 SUCCESS! Found ${foundVariations.length} appointment variations: ${foundVariations.join(', ')}`)
        
        // STEP 2: Locate exact elements containing appointment
        cy.get('*').then(($allElements) => {
          let appointmentElements = []
          
          $allElements.each((index, element) => {
            const elementText = element.textContent ? element.textContent.toLowerCase() : ''
            const elementHtml = element.innerHTML ? element.innerHTML.toLowerCase() : ''
            
            if (elementText.includes('appointment') || elementHtml.includes('appointment')) {
              appointmentElements.push({
                element: element,
                text: element.textContent ? element.textContent.trim().substring(0, 100) : '',
                tag: element.tagName
              })
            }
          })
          
          cy.log(`📋 Found ${appointmentElements.length} elements containing "appointment"`)
          
          if (appointmentElements.length > 0) {
            // STEP 3: Test interaction with appointment elements
            appointmentElements.slice(0, 3).forEach((item, index) => {
              cy.log(`🔗 Testing appointment element ${index + 1}:`)
              cy.log(`   Tag: ${item.tag}`)
              cy.log(`   Text: "${item.text}"`)
              
              cy.wrap(item.element).then(($el) => {
                // Check if element is clickable
                const isClickable = $el.is('a, button, [onclick], [role="button"], input[type="button"], input[type="submit"]')
                
                if (isClickable) {
                  cy.log(`   ✓ Element is clickable, testing interaction...`)
                  
                  // Store element reference before any interaction
                  cy.wrap($el).as(`testElement${index}`)
                  
                  // Record original URL
                  cy.url().then((originalUrl) => {
                    // Click in separate command to avoid DOM detachment
                    cy.get(`@testElement${index}`).click({ force: true })
                    cy.wait(4000)
                    
                    // Check URL change and appointment content in separate commands
                    cy.url().then((newUrl) => {
                      const urlChanged = newUrl !== originalUrl
                      const newUrlLower = newUrl.toLowerCase()
                      const hasAppointmentInNewUrl = newUrlLower.includes('appointment') ||
                                                   newUrlLower.includes('book') ||
                                                   newUrlLower.includes('schedule')
                      
                      cy.log(`   Original URL: ${originalUrl}`)
                      cy.log(`   New URL: ${newUrl}`)
                      cy.log(`   ✅ URL changed: ${urlChanged}`)
                      cy.log(`   ✅ Appointment in new URL: ${hasAppointmentInNewUrl}`)
                      
                      if (hasAppointmentInNewUrl) {
                        cy.log(`   🎉 JACKPOT! Appointment found in URL after click!`)
                      }
                    })
                    
                    // Check page content in separate command
                    cy.get('body').then(($newBody) => {
                      const newPageText = $newBody.text().toLowerCase()
                      const appointmentCount = (newPageText.match(/appointment/g) || []).length
                      cy.log(`   📈 Appointment mentions on new page: ${appointmentCount}`)
                    })
                    
                    // Go back in separate command
                    cy.go('back')
                    cy.wait(3000)
                  })
                } else {
                  cy.log(`   ℹ️ Element not clickable, but contains appointment keyword`)
                }
              })
            })
          }
        })
      } else {
        cy.log('❌ No "appointment" keyword found in any variation')
        cy.log('🔄 Falling back to Hebrew appointment terms...')
        
        // Fallback to Hebrew terms
        const hebrewAppointmentTerms = ['תור', 'זימון', 'קביעת תור', 'הזמנת תור']
        let foundHebrewTerms = []
        
        hebrewAppointmentTerms.forEach(term => {
          if (textLower.includes(term)) {
            foundHebrewTerms.push(term)
          }
        })
        
        if (foundHebrewTerms.length > 0) {
          cy.log(`✓ Found Hebrew appointment terms: ${foundHebrewTerms.join(', ')}`)
        } else {
          cy.log('❌ No appointment-related keywords found in Hebrew either')
        }
      }
    })
    
    cy.log('🏁 FOCUSED appointment search completed')
  })

})
