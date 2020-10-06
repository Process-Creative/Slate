import { getThemeUrl } from './../../../Utils';

context('Locale', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should have the lang attr on the HTML element', () => {
    cy.get('html')
      .should('have.attr', 'lang')
    ;
  });

  it('should not have missing language strings', () => {
    cy.get('html').then(html => {
      expect(html.text()).not.to.contain('translation missing');
    });
  })
})