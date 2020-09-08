const fs = require('fs');
const path = require('path');
const SlateConfig = require('@process-creative/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = function() {
  const entrypoints = {};

  fs.readdirSync(config.get('paths.theme.src.layout')).forEach((file) => {
    const name = path.parse(file).name;
    const scriptPath = path.join(config.get('paths.theme.src.scripts'), 'layout');

    [ 'js', 'ts', 'jsx', 'tsx' ].some(ext => {
      const filePath = path.join(scriptPath, `${name}.${ext}`);
      if(!fs.existsSync(filePath)) return false;
      entrypoints[`layout.${name}`] = filePath;
      return true;
    });
  });
  
  return entrypoints;
};
