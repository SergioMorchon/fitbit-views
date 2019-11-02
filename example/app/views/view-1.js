import document from 'document';
import { next } from './';

// Receives a count parameter
export default count => {
	document.getElementById(
		'message',
	).text = `View 1. Count will start at ${count}`;
	document.getElementById('next-button').onactivate = () => {
		next('view-2', count);
	};
};
