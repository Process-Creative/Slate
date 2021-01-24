import { getTemplate, GetTemplateParams } from './generate-tags-template';

export const getStyleTemplate = ({ htmlWebpackPlugin }:GetTemplateParams) => {
  const { liquidTemplates, liquidLayouts, isDevServer } = htmlWebpackPlugin.options;
  return getTemplate({
    liquidTemplates, liquidLayouts, isDevServer,
    files: htmlWebpackPlugin.files.css,
    genTemplate: ({ src }) => `<link rel="stylesheet" href="${src}" type="text/css" />`
  });
}