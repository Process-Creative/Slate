import { getTemplate, GetTemplateParams } from './generate-tags-template';

export const getScriptTemplate = ({ htmlWebpackPlugin }:GetTemplateParams) => {
  const { liquidTemplates, liquidLayouts, isDevServer } = htmlWebpackPlugin.options;
  return getTemplate({
    liquidTemplates, liquidLayouts, isDevServer,
    files: htmlWebpackPlugin.files.js,
    genTemplate: ({ src }) => `<script type="text/javascript" src="${src}" defer></script>`
  });
}