import { setup, next } from 'fitbit-views';
import main from './views/main';
import view1 from './views/view-1';
import view2 from './views/view-2';

// Initialize the views...
setup({
	main: main,
	'view-1': view1,
	'view-2': view2,
});

// ... and goes to the main one
next('main');
