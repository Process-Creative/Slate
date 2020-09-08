export type CypressTest = typeof CYPRESS_TESTS[number] | string;

export const CYPRESS_TESTS = <const>[
  'all/Window.ts',

  'layout/theme/Favicon.ts',
  'layout/theme/JavaScript.ts',
  
  'template/product/VariantSelector.ts'
];