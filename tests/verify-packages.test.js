//Setup, load in the packages for each package
const fs = require('fs');
const path = require('path');
const root = path.resolve('.', 'packages');
const dirs = fs
  .readdirSync(root)
  .map(dir => path.join(root, dir))
  .filter(dir => fs.statSync(dir).isDirectory)
;

let packages = dirs.map(dir => {
  return JSON.parse(fs.readFileSync(path.join(dir, 'package.json')));
});

//Make sure we're testing something
describe('dirs', () => {
  it('should be multiple directories', () => {
    expect(dirs.length).toBeGreaterThan(0);
  });
});

describe('package.json', () => {
  it('should be defined', () => {
    expect(packages.every(pkg => typeof pkg !== typeof undefined)).toStrictEqual(true);
  });

  it('should have a name', () => {
    expect(packages.every(pkg => typeof pkg.name === 'string')).toStrictEqual(true);
  });

  it('should be inside each package', () => {
    expect(packages).toHaveLength(dirs.length);
  });

  packages.forEach(pkg => {
    it(`${pkg.name} should have github packages settings defined`, () => {
      expect(pkg.publishConfig).toBeDefined();
      expect(pkg.publishConfig.registry).toStrictEqual('https://npm.pkg.github.com/Process-Creative');
      expect(pkg.publishConfig.access).toStrictEqual('restricted');
      expect(pkg.publishConfig.registry.length).toBeGreaterThan(0);
    });

    it(`${pkg.name} should have repository settings defined`, () => {
      expect(pkg.repository).toBeDefined();
      expect(pkg.repository.type).toStrictEqual('git');
      expect(pkg.repository.url).toStrictEqual('ssh://git@github.com/Process-Creative/slate.git');
      expect(pkg.repository.directory).toBeDefined();
    });
  })
})