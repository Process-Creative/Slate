import { fail } from 'assert';
import { getThemeUrl } from './../../../Utils';

const SELECTOR_CHARSET = 'meta[charset]';

context('Charset', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should have a charset', () => {
    cy.get(SELECTOR_CHARSET)
      .should('exist')
      .should('have.attr', 'charset')
    ;
  })

  it('should be utf8', () => {
    cy.get(SELECTOR_CHARSET).then(meta => {
      expect(meta.attr('charset')).to.eq('utf-8');
    });
  });
})