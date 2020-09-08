import { getThemeUrl } from './../../../Utils';

context('JavaScript', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('header should have a favicon', () => {
    cy.get('link[rel="shortcut icon"]')
      .should('exist')
      .should('have.property', 'href')
    ;
  });
})