import document from 'document';
import { buttons, back } from './';

export default count => {
	const update = () => {
		document.getElementById('message').text = `View 2. Count is: ${count}`;
	};

	update();
	const intervalId = setInterval(() => {
		count++;
		update();
	}, 1000);
	// We manually handle the back button action so we can customize the navigation...
	buttons.back = () => {
		// ... and pass back the current count
		back(count);
	};

	// We must cleanup the running stuff, so we return a callback that will be called whenever this view gets unloaded
	return () => clearInterval(intervalId);
};
