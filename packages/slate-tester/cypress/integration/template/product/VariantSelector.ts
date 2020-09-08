import { getThemeUrl } from './../../../Utils';

context('VariantSelector', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/products/whitening-strips-14-treatments'));
  });

  it('variant selector should exist', () => {
    cy.get('[name="id"]').should('exist').should('have.length.above', 0);
  });
})