import { getThemeUrl } from './../../../Utils';

context('JavaScript', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should have js-available class', () => {
    cy.wait(100)
      .get('html')
      .should('have.class', 'js-available')
    ;
  });
})