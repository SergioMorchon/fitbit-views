import { display } from 'display';
import document from 'document';

/**
 * Will be called when the view gets unloaded.
 */
type Dispose = () => void;
type ViewModel = (params?: any) => Dispose | void;
type ViewsMap = {
	[viewId: string]: () => Promise<{ readonly default: ViewModel }>;
};
type SetupOptions = {
	getViewFilename?: (viewId: string) => string;
};

export /**
 * Initialize all the views. By default, they will be loaded from `resources/` with a `.gui` extension.
 * @param views A map to relate the each `view id` with its `view` initialization.
 * @param path Prepend your custom path, if any. Useful to load views under deeper paths like `resources/views/`.
 */
const setup = (views: ViewsMap, options?: SetupOptions) => {
	let currentDispose: Dispose | void;
	let stack: Array<string> = [];

	const next = (viewId: string, params?: any) => {
		stack.push(viewId);
		load(viewId, params);
	};

	const back = (params?: any) => {
		stack.pop();
		const viewId = stack[stack.length - 1];
		if (!viewId) {
			return;
		}

		load(viewId, params);
	};

	const load = (viewId: string, params: any) => {
		if (currentDispose) {
			currentDispose();
		}

		const getViewModel = views[viewId];
		if (!getViewModel) {
			throw new Error(`Unknown view: ${viewId}`);
		}

		delete buttons.back;
		document.replaceSync(
			options && options.getViewFilename
				? options.getViewFilename(viewId)
				: `./resources/${viewId}.gui`,
		);
		document.addEventListener('keypress', e => {
			if (e.key === 'back') {
				if (buttons.back) {
					buttons.back();
				} else {
					back();
				}

				if (stack.length) {
					e.preventDefault();
				}
			}
		});

		display.poke();
		getViewModel()
			.then(m => {
				currentDispose = m.default(params);
			})
			.catch(e => {
				console.error(e);
			});
	};

	const buttons: {
		/**
		 * Will be called when the back button gets pressed.
		 */
		back?: () => void;
	} = {};

	return {
		next,
		back,
		buttons,
	};
};
