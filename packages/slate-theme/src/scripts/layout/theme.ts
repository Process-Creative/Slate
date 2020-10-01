import './../base';

//Import Theme Styles
import '../../styles/layout/theme.scss';

//Theme Objects

//Theme Components

//Theme Tools
if(process.env.NODE_ENV === 'development') {
  const SOME_VAR = 'SOME_VALUE';
  //Dev Tools
  require('../tools/layout/grid-view/GridView');
}

// Let CSS know JS is available
document.documentElement.classList.remove('js-unavailable');
document.documentElement.classList.add('js-available');