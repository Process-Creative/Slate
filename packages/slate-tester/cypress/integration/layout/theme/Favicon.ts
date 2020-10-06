import { fail } from 'assert';
import { getThemeUrl } from './../../../Utils';

const SELECTOR_FAVICON = 'link[rel="shortcut icon"]';

context('Favicon', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should have a favicon', () => {
    cy.get(SELECTOR_FAVICON)
      .should('exist')
      .should('have.attr', 'href')
    ;
  });

  it('should have the favicon type', () => {
    cy.get(SELECTOR_FAVICON)
      .should('have.attr', 'type')
    ;
  })
})