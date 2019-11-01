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
	if (currentDispose) {
		currentDispose();
	}

	const resolveViewModel = setupViews[viewId];
	if (!resolveViewModel) {
		throw new Error(`Unknown view: ${viewId}`);
	}

	delete buttons.back;
	document.replaceSync(
		setupOptions && setupOptions.getViewFilename
			? setupOptions.getViewFilename(viewId)
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
	resolveViewModel().then(m => {
		currentDispose = m.default(params);
	});
};
