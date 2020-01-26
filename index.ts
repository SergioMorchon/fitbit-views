import { display } from 'display';
import document from 'document';

/**
 * Will be called when the view gets unloaded.
 */
type Dispose = () => void;
type ViewModel = (params?: any) => Dispose | void;
type ViewsMap = {
	[viewId: string]: ViewModel;
};
type SetupOptions = {
	getViewFilename?: (viewId: string) => string;
};

let currentDispose: Dispose | void;
let stack: Array<string> = [];
let setupViews: ViewsMap = {};
let setupOptions: SetupOptions | void;

/**
 * Handle hardware button actions.
 */
export const buttons: {
	/**
	 * Will be called when the back button gets pressed.
	 */
	back?: () => void;
} = {};
/**
 * Initialize all the views. By default, they will be loaded from `resources/` with a `.gui` extension.
 * @param views A map to relate the each `view id` with its `view` initialization.
 * @param path Prepend your custom path, if any. Useful to load views under deeper paths like `resources/views/`.
 */
export const setup = (views: ViewsMap, options?: SetupOptions) => {
	setupViews = views;
	setupOptions = options;
	stack = [];
};

export const next = (viewId: string, params?: any) => {
	stack.push(viewId);
	load(viewId, params);
};

export const back = (params?: any) => {
	stack.pop();
	const viewId = stack[stack.length - 1];
	if (!viewId) {
		return;
	}

	load(viewId, params);
};

const load = (viewId: string, params: any) => {
	const viewModel = setupViews[viewId];
	if (!viewModel) {
		throw new Error(`Unknown view: ${viewId}`);
	}

	if (currentDispose) {
		currentDispose();
	}

	delete buttons.back;
	document.replaceSync(
		setupOptions && setupOptions.getViewFilename
			? setupOptions.getViewFilename(viewId)
			: `./resources/${viewId}.gui`,
	);
	document.addEventListener('keypress', e => {
		if (e.key === 'back') {
			(buttons.back || back)();
			if (stack.length) {
				e.preventDefault();
			}
		}
	});

	setTimeout(() => {
		currentDispose = viewModel(params);
	}, 0);
	display.poke();
};
