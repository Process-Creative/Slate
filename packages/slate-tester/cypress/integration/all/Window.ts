import { getThemeUrl } from "../../Utils";

context('Window', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  })

  it('cy.window() - get the global window object', () => {
    cy.window().should('exist');
  })
})
