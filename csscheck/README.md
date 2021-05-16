
# checkcss

Utility method for warning any time the `class` attribute of an element references undefined / non-existent CSS class.

In addition to doing a sweep of the DOM at the time `cssCheck()` is called, this sets up a `MutationObserver` to continuously monitor DOM changes, so is well-suited for dynamic webapps.

(Note: The monitoring logic is pretty efficient but is probably not something you want to be running in production.)


## Installation

```
npm i csscheck
```

## Usage

```javascript
import checkCSS, { cssMonitor } from 'checkcss';

// Check current DOM
checkCSS();

// ... and setup monitor to check DOM as it changes
monitorCSS();
```
