# Fitbit Views

[![npm version](https://badge.fury.io/js/fitbit-views.svg)](https://www.npmjs.com/package/fitbit-views)
[![CI Status](https://github.com/SergioMorchon/fitbit-views/workflows/CI/badge.svg)](https://github.com/SergioMorchon/fitbit-views/actions?query=workflow%3ACI)

Build rich Fitbit apps with ease.
This module will take care of:

- Lazily loading your GUI files.
- Provide basic navigation functions: `next` and `back`.

## Add it to your project

`npm install --save fitbit-views`

## Use it

In your project, you will have your views files like the following example:

- `resources/view-1.gui`.
- `resources/view-2.gui`.

Your view runtime code simlar to:

- `app/views/view-1.js`.
- `app/views/view-2.js`.

The main file for your app:

- `app/index.js`.

So with that in mind...

### Setup your views

**index.js**

```javascript
import { setup, next } from 'fitbit-views';
import view1 from './views/view-1';
import view2 from './views/view-2';

setup({
	'view-1': view1,
	'view-2': view2,
});
next('view-1');
```

### Bring your view to life

**view-1.js**

```javascript
import document from 'document';
import { next } from 'fitbit-views';

export default () => {
	document.getElementById('some-text').text = 'Hi there :)';
	document.getElementById('my-button').onactivate = () => next('view-2');
};
```

You get the idea!

## What's in the box

- `setup`: initialize your views.
- `next`: navigate forwards. You can also pass a parameter.
- `back`: navigate backwards. You can also pass a parameter.`
- `buttons`:

  - `back`: manually handle the back action, avoiding the _default_ back action. This allows to manually control whether to go back or not.

    ```typescript
    import document from 'document';
    import { buttons, back } from 'fitbit-views';

    export default () => {
    	document.getElementById('my-button').onactivate = () => {
    		if (someCondition) {
    			back();
    		}

    		// else, nothing happens: no navigation
    	};
    };
    ```

Your view functions will be called with the passed parameter (if any).
Bear in mind that your view may be using extra resources that must be disposed before navigating to another view.
In that case, just return a callback at the end of your view function, and it will be called right before navigating.

You can also take a look at the API in [the code](./index.ts). There you'll find also how to create fully dynamic views, including the GUI content.
This enable developers to create and pack full views (both UI and functionality).
