import { xorBy } from 'cypress/types/lodash';
import { getThemeUrl } from './../../Utils';

context('Sitemap', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should be reachable', () => {
    cy.request(getThemeUrl('/sitemap.xml')).should(response => {
      expect(response).to.have.property('headers');
      expect(response.headers['content-type']).to.include('application/xml')
    })
  });
})