import { setup, next } from 'fitbit-views';

// Initialize the views...
setup({
	main: () => import('./views/main'),
	'view-1': () => import('./views/view-1'),
	'view-2': () => import('./views/view-2'),
});

// ... and goes to the main one
next('main');
