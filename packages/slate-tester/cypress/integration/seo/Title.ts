import { getThemeUrl } from './../../Utils';

context('Title', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should have exactly one title', () => {
    cy.get('title')
      .should('exist')
      .should('have.length', 1)
    ;
  });
})