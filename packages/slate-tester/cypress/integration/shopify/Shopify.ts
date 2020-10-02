import { getTheme, getThemeUrl } from './../../Utils';

context('Shopify', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should be a Shopify site', () => {
    cy.window().then(window => {
      expect(window).to.have.property('Shopify');

      const { Shopify } = window as any;
      expect(Shopify).to.have.property('shop', getTheme().shopName);
      
      if(getTheme().themeId) {
        expect(Shopify).to.have.property('theme');
        expect(Shopify.theme).to.have.property('id', getTheme().themeId);
      }
    })
  });
})