export type CypressTest = typeof CYPRESS_TESTS[number] | string;

export const CYPRESS_TESTS = <const>[
  'development/Deployed.ts',
  'development/Named.ts',

  'layout/theme/Charset.ts',
  'layout/theme/Favicon.ts',
  'layout/theme/JavaScript.ts',
  'layout/theme/Locale.ts',

  'seo/Title.ts',
  'seo/Sitemap.ts',

  'shopify/Shopify.ts',
  
  'template/product/VariantSelector.ts'
];