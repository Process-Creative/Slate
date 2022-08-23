import { pictureGenerate } from './../index';

describe('pictureGenerate', () => {
  it('work', () => {

    expect(pictureGenerate({
      src: 'https://cdn.shopify.com/s/files/1/1099/4438/products/all-belts-007_350x403.jpg?v=1575931882',
      srcSize: 600,
      class: 'o-product-tile__image-picture',
      sizes: [
        { size: 375 },
        { size: 300, screen: 480 },
        { size: 300, screen: 2000 }
      ]
    })).toEqual('');

  });

});