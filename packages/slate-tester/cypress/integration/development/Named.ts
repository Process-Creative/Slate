import { getThemeUrl } from './../../Utils';

context('Named', () => {
  beforeEach(() => {
    cy.visit(getThemeUrl('/'));
  });

  it('should be named appropriately', () => {
    cy.window().then(window => {
      const { Shopify } = window as any;
      const { theme } = Shopify;

      expect(theme).to.have.property('name');
      let name = (theme.name as string).split(' ');
      expect(name).to.have.length.greaterThan(0);
      
      const [ process, stage ] = name;
      expect(process).to.eq('Process');
      expect(stage).to.match(/Dev|Development|Production|Prod|Staging/g);
      cy.log(`Theme Stage is ${stage}`);

      if(name.length < 3) {
        cy.log(`Theme has no date`);
        return;
      }

      const backupOrDate = name[2];
      let date,nameStart;
      if(backupOrDate == 'BU') {
        date = name[3];
        nameStart = 4;
        cy.log(`Testing on a theme backup`);
      } else {
        date = backupOrDate;
        nameStart = 3;
      }
      
      //Expect YYMMDD format
      expect(date).to.have.length(6);
      expect(date).to.not.match(/\D/g);
      cy.log(`Theme is dated to ${date}`);

      if(name.length <= nameStart) {
        cy.log(`Theme has no name`);
        return;
      }

      cy.log(`Theme is named`);
    });
  });
})