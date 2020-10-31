//Setup, load in the packages for each package
const fs = require('fs');
const path = require('path');

const PACKAGES_DIR_NAME = 'packages';
const PACKAGES_DIR = path.resolve('.', PACKAGES_DIR_NAME);
const PACKAGES = fs
  .readdirSync(PACKAGES_DIR)
  .map(dir => path.join(PACKAGES_DIR, dir))
  .filter(dir => fs.statSync(dir).isDirectory())
;

let PACKAGE_JSONS = PACKAGES.map(dir => {
  return JSON.parse(fs.readFileSync(path.join(dir, 'package.json')));
});

//Make sure we're testing something
describe('PACKAGES', () => {
  it('should be multiple directories', () => {
    expect(PACKAGES.length).toBeGreaterThan(0);
  });
});

describe('PACKAGE_JSONS', () => {
  it('should be defined', () => {
    expect(PACKAGE_JSONS.every(pkg => typeof pkg !== typeof undefined)).toStrictEqual(true);
  });

  it('should have a name', () => {
    expect(PACKAGE_JSONS.every(pkg => typeof pkg.name === 'string')).toStrictEqual(true);
  });

  it('should be inside each package', () => {
    expect(PACKAGE_JSONS).toHaveLength(PACKAGES.length);
  });

  PACKAGE_JSONS.forEach(pkg => {
    it(`${pkg.name} should have github packages settings defined`, () => {
      expect(pkg.publishConfig).toBeDefined();
      expect(pkg.publishConfig.registry).toStrictEqual('https://npm.pkg.github.com/Process-Creative');
      expect(pkg.publishConfig.access).toStrictEqual('restricted');
      expect(pkg.publishConfig.registry.length).toBeGreaterThan(0);
    });

    it(`${pkg.name} should have repository settings defined`, () => {
      expect(pkg.repository).toBeDefined();
      expect(pkg.repository.type).toStrictEqual('git');
      expect(pkg.repository.url).toStrictEqual('ssh://git@github.com/Process-Creative/slate-v2.git');
      expect(pkg.repository.directory).toBeDefined();
    });

    it(`${pkg.name} should have the correct repositor directory`, () => {
      expect(pkg.repository.directory).toEqual(`${PACKAGES_DIR_NAME}/${pkg.name.split('/').pop()}`);
    })
  })
})