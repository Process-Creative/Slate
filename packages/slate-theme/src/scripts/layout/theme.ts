import './../base';

//Import Theme Styles
import '../../styles/layout/theme.scss';

//Theme Objects
import '../components/feedback/warning';

import '../components/navigation/header';
import '../components/navigation/topbar';

//Theme Components

//Theme Tools

// Let CSS know JS is available
document.documentElement.classList.remove('js-unavailable');
document.documentElement.classList.add('js-available');

//Development mode specific scripts
if(process.env.NODE_ENV === 'development') {
  
}