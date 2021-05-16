
# checkcss

Utility method for warning any time the `class` attribute of an element references an undefined CSS class.

This module provides two methods:

* `checkCSS()` performs a one-time sweep of the DOM.
* `monitorCSS()` Sets up a
[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) to continuously monitor DOM changes, looking for elements tha treference undefined CSS classes. (Useful for React apps, single-page apps that dynamically update the DOM.)

(Note: `monitorCSS()` pretty efficient but is probably not something you want to be running in production.)


## Installation

```
npm i checkcss
```

## Usage

```javascript
import checkCSS, { monitorCSS } from 'checkcss';

// Check current DOM
checkCSS();

// ... and setup monitor to check DOM as it changes
monitorCSS();
```
