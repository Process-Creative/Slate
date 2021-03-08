import HtmlWebpackPlugin from "html-webpack-plugin";

export type GenTemplateParams = {
  files:string[];
  isDevServer:boolean;
  condition?: string;
  value?: string;
  src?: string;
  liquidTemplates: {
    [key: string]: string;
  };
  liquidLayouts: {
    [key: string]: string;
  };
  genTemplate: (generateTemplates: GenTemplateParams) => string;
};

export type GetTemplateParams = {
  htmlWebpackPlugin: HtmlWebpackPlugin & { options:GenTemplateParams } & {
    files: {
      css: string[];
      js: string[];
    }
  };
};

const ifHasConditionScript = (params: GenTemplateParams) => {
  const { condition, value, genTemplate } = params;
  return `{%- if ${condition} == '${value}' -%}
    ${genTemplate(params)}
  {%- endif -%}`;
}

export const getTemplate = (params:GenTemplateParams) => {
  const { files, liquidTemplates, liquidLayouts, isDevServer, genTemplate } = params;
  return files.reduce((x,file) => {
    const basename = file.split('/').reverse()[0];
    const basenameNoExt = basename.split('.').slice(0, -1).join('.');
    const src = isDevServer ? file : `{{ '${basename}' | asset_url }}`;

    const layoutTemplateBits = basename.split('.');
    layoutTemplateBits.shift();
    layoutTemplateBits.pop();
    const layoutTemplateName = layoutTemplateBits.join('.');

    if(liquidLayouts[basenameNoExt]) {
      x += ifHasConditionScript({ ...params,
        condition: 'layout', value: layoutTemplateName, src
      });
    } else if(file.split('@').length > 1) {
      
      //Incomplete, not likely used as of now.
      throw new Error();

    } else if(liquidTemplates[basenameNoExt]) {
      const template = liquidTemplates[basenameNoExt];

      let targetTemplate = layoutTemplateName;
      const templateSubdir = [
        'customers'
      ].find(t => template.includes(`${t}\\`) || template.includes(`${t}/`));
      if(templateSubdir) {
        targetTemplate = `${templateSubdir}/${targetTemplate}`;
      }
      
      x += ifHasConditionScript({ ...params,
        condition: 'template', value: targetTemplate, src
      });
    } else {
      x += genTemplate({ ...params, src });
    }
    return x;
  }, '');
}