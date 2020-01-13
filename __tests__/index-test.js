import { setup, next, back, buttons } from '../index.ts';
import document from 'document';

describe('setup', () => {
	test('does not call the view creators', () => {
		const v1 = jest.fn();
		setup({ v1 });
		expect(v1).not.toHaveBeenCalled();
	});
});

describe('view file name', () => {
	test('by default resolves to the app resources path', () => {
		const replaceSync = jest.fn();
		document.replaceSync = replaceSync;

		setup({
			v1: jest.fn(),
		});
		next('v1');

		expect(replaceSync).toHaveBeenCalledWith('./resources/v1.gui');
	});

	test('can be customized through setup', () => {
		const replaceSync = jest.fn();
		document.replaceSync = replaceSync;

		const getViewFilename = jest.fn(viewId => `fiew-filename: ${viewId}`);

		setup(
			{
				v1: jest.fn(),
			},
			{
				getViewFilename,
			},
		);
		next('v1');

		expect(getViewFilename).toHaveBeenCalledWith('v1');
		expect(replaceSync).toHaveBeenCalledWith('fiew-filename: v1');
	});
});

describe('navigation', () => {
	test('next with params', () => {
		const v1 = jest.fn();
		setup({ v1 });
		const params = {};
		next('v1', params);

		expect(v1).toHaveBeenCalledWith(params);
	});

	test('next and back', () => {
		const v1 = jest.fn();
		const v2 = jest.fn();
		const replaceSync = jest.fn();
		document.replaceSync = replaceSync;

		setup({ v1, v2 });
		next('v1');
		expect(replaceSync).lastCalledWith('./resources/v1.gui');
		next('v2');
		expect(replaceSync).lastCalledWith('./resources/v2.gui');
		back();
		expect(replaceSync).lastCalledWith('./resources/v1.gui');
	});

	test('calls to view dispose before navigating', () => {
		const dispose = jest.fn();
		const v1 = jest.fn(() => dispose);
		const v2 = jest.fn();
		const replaceSync = jest.fn();
		document.replaceSync = replaceSync;

		setup({ v1, v2 });
		next('v1');
		expect(dispose).not.toHaveBeenCalled();
		next('v2');
		expect(dispose).toHaveBeenCalledTimes(1);
	});

	test('back with params', () => {
		const v1 = jest.fn();
		const v2 = jest.fn();
		setup({ v1, v2 });
		next('v1');
		expect(v1).toHaveBeenLastCalledWith(undefined);
		next('v2');
		const params = {};
		back(params);

		expect(v1).toHaveBeenLastCalledWith(params);
	});

	test('next throws for unknown view', () => {
		setup({});
		expect(() => {
			next('nope');
		}).toThrowError(/^Unknown view: nope$/);
	});

	test('does not call dispose if navigates to unknown view', () => {
		const dispose = jest.fn();
		const v1 = jest.fn(() => dispose);
		setup({ v1 });
		next('v1');
		expect(v1).toHaveBeenCalled();
		expect(() => {
			next('nope');
		}).toThrowError(/^Unknown view: nope$/);
		expect(dispose).not.toHaveBeenCalled();
	});

	test('back if the stack is empty does not load any view', () => {
		const replaceSync = jest.fn();
		document.replaceSync = replaceSync;

		setup({});
		back();
		expect(replaceSync).not.toHaveBeenCalled();
	});
});

describe('hardware buttons', () => {
	test('listens for keypress within the view document', () => {
		const addEventListener = jest.fn();
		document.addEventListener = addEventListener;

		setup({
			v1: jest.fn(),
		});
		next('v1');

		const { calls } = addEventListener.mock;
		expect(calls.length).toBe(1);
		const [eventName, eventCallback] = calls[0];
		expect(eventName).toBe('keypress');
		expect(typeof eventCallback).toBe('function');
	});

	test('prevents the default action for the back key press', () => {
		const callbackMap = {};
		const addEventListener = jest.fn((eventName, callback) => {
			callbackMap[eventName] = callback;
		});
		document.addEventListener = addEventListener;

		const backHandler = jest.fn();
		const preventDefault = jest.fn();

		setup({
			v1: () => {
				buttons.back = backHandler;
			},
		});
		next('v1');

		expect(addEventListener).toBeCalled();
		callbackMap['keypress']({
			key: 'back',
			preventDefault,
		});
		expect(backHandler).toBeCalled();
		expect(preventDefault).toBeCalled();
	});
});
