import document from 'document';
import { next } from './';

export default () => {
	document.getElementById('next-button').onactivate = () => {
		// Goes to view-1 passing a 0 as a parameter
		next('view-1', 0);
	};
};
