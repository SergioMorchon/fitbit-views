import { setup } from 'fitbit-views';

export const { next, back, buttons } = setup({
	main: () => import('./main'),
	'view-1': () => import('./view-1'),
	'view-2': () => import('./view-2'),
});
