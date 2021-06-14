const seen = new Set();
let defined;

let ignoreRE;
export function ignoreCSS(re) {
  ignoreRE = re;
}

function checkClassNames(node, includeChildren = false) {
  if (node?.classList)  {
    for (const cl of node.classList) {
      // Ignore if matches the ignore regex
      if (ignoreRE.test(cl)) continue;

      // Ignore defined and already-seen classes
      if (defined.has(cl) || seen.has(cl)) continue;
      // Mark as seen
      seen.add(cl);

      console.warn(`Undefined CSS class: ${cl}`);
    }
  }

  if (includeChildren) {
    for (const el of node.querySelectorAll('*')) {
      checkClassNames(el);
    }
  }
}

function ingestRules(rules) {
  for (const rule of rules) {
    if (!rule) continue;
    let cssRules;
    try {
      cssRules = rule.cssRules;
    } catch (err) {
      console.log(`Unable to access ${rule.href}`);
      continue;
    }
    if (rule?.cssRules) { // Rules can contain sub-rules (e.g. @media, @print)
      ingestRules(rule.cssRules);
    } else if (rule.selectorText) {
      // Get defined classes.  (Regex here could probably use improvement)
      const classes = rule.selectorText?.match(/\.[\w-]+/g);
      if (classes) {
        for (const cl of classes) { defined.add(cl.substr(1)); }
      }
    }
  }
}

export function monitorCSS() {
  const observer = new MutationObserver(mutationsList => {
    for (const mut of mutationsList) {
      if (mut.type === 'childList' && mut?.addedNodes) {
        for (const el of mut.addedNodes) {
          // Ignore text nodes
          if (el.nodeType == 3) continue;

          // Sweep DOM fragment
          checkClassNames(el);
          for (const cel of el.querySelectorAll('*')) {
            checkClassNames(cel);
          }
        }
      } else if (mut?.attributeName == 'class') {
        // ... if the element 'class' changed
        checkClassNames(mut.target);
      }
    }
  });

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true
  });
}

export default function checkCSS() {
  if (defined) return defined;
  defined = new Set();

  // Cache
  ingestRules(document.styleSheets);

  // Do a sweep of the existing DOM
  checkClassNames(document, true);
}
