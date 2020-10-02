import { getThemeUrl } from './../../Utils';

context('Deployed', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should be deployed into', () => {
    cy.get('script').each(element => {
      if(!element.attr('src')) return;
      expect(element).to.have.attr('src');
      
      //Local Subnets
      expect(element.attr('src')).not.to.contain('//127.');
      expect(element.attr('src')).not.to.contain('//localhost');

      //Non Routables
      expect(element.attr('src')).not.to.contain('//10.');
      expect(element.attr('src')).not.to.contain('//192.168');
      
      let start = 16, end = 31;
      for(let i = start; i <= end; i++) {
        expect(element.attr('src')).not.to.contain(`//172.${i}.`);
      }
    })
  });
})