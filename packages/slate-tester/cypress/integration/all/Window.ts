context('Window', () => {
  beforeEach(() => {

  })

  it('cy.window() - get the global window object', () => {
    cy.window().should('exist');
  })
})
