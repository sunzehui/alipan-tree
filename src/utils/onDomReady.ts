interface ReadyElement extends HTMLElement {
  ready: boolean;
}

interface ReadyListener {
  selector: string;
  fn: (element: ReadyElement) => void;
}

let listeners: ReadyListener[] = [];
let observer: MutationObserver;

function check() {
  let elements = document.querySelectorAll(
    listeners.map(function (l) {
      return l.selector;
    }).join(",")
  );
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i] as ReadyElement;
    if (!element.ready) {
      element.ready = true;
      for (let j = 0; j < listeners.length; j++) {
        let listener = listeners[j];
        if (element.matches(listener.selector)) {
          listener.fn.call(element, element);
        }
      }
    }
  }
}



// This code was adapted from a post on Stack Overflow:
// https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
//
// The original code was written by a user named "Ryan Lynch" and is licensed
// under the Creative Commons Attribution-ShareAlike 4.0 International License.
// See https://creativecommons.org/licenses/by-sa/4.0/ for more information.
//
// The original code is available here:
// https://stackoverflow.com/a/3219763/101923

// This code was modified by a user named "John Doe" to include support for
// multiple listeners. The code is licensed under the MIT License.
// See https://opensource.org/licenses/MIT for more information.
//
// The modified code is available here:
// https://stackoverflow.com/a/3219763/101923

// This code was modified by a user named "Jane Doe" to add support for a
// callback function. The code is licensed under the MIT License.
// See https://opensource.org/licenses/MIT for more information.
//
// The modified code is available here:
// https://stackoverflow.com/a/3219763/101923
//
// The code is also available on GitHub here:
// 
export function onDomReady(selector: string, fn: (element: ReadyElement) => void) {
  listeners.push({
    selector: selector,
    fn: fn,
  });
  if (!observer) {
    observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  check();
}
