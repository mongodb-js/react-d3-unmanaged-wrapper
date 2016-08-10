# react-d3-component [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

React component that uses Mike Bostock's [reusable charts][reusable-charts] pattern
to render d3 code inside a `<svg>` or `<div>` container.

## Example

Create your d3 drawing code following the [reusable charts][reusable-charts]
pattern. For example, create a file `./d3fn.js`:

```javascript
/**
 * Follow Mike Bostock's "reusable charts" pattern returning a closure
 * to (re-)draw the d3 content.
 *
 * The outer function sets up private variables like width, height, etc.
 * and returns the inner function (closure) to draw and update the chart.
 *
 * @return {Function}   drawing function that needs to handle both initial
 *                      drawing and updating of the chart.
 */
const d3fn = function() {
  // --- define private variables
  let width;  
  let height;

  // --- set up one-time elements like scales here...

  /**
   * The inner function generates and updates the chart.
   *
   * @param selection {d3.selection}   selection containing a chart
   */
  function inner(selection) {
    selection.each(function(data) {
      // generate chart here: `data` is the data and `this` is the container element
    });
  };

  // --- getter-setter functions here

  inner.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return inner;
  };

  inner.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return inner;
  };

  return inner;
}

module.exports = d3fn;
```

Now set up and render the D3 component, e.g. in `./index.js`:

```javascript

const ReactDOM = require('react-dom');
const D3Component = require('hadron-react-d3-component');
const d3fn = require('./d3fn');

const options = {
  width: 800,
  height: 200,
  renderMode: 'svg',
  d3fn: d3fn,
  data: [14, 19, 25, 6, 9, 24, 31]
};

const chart = <D3Component {...options} />;
ReactDOM.render(chart, document.body);
```


## React and D3

There are several different ways to combine d3 and React code. The issue
is that they both manipulate the DOM in different ways. React
uses a virtual DOM, and an efficient diff-ing algorithm, and updates only the DOM
nodes that actually need to change. d3 accesses the DOM directly, and through
data binding updates the DOM nodes that have been modified.

The approach taken here is quite simple. React sets up (and "owns") the container
but considers the elements inside the container unmanaged and leaves their
handling to d3. This is achieved by calling the d3 drawing function on
`componentDidMount` (for initial setup) and `componentDidUpdate` (for redrawing).



## License

Apache 2.0

[travis_img]: https://img.shields.io/travis/mongodb-js/react-d3-component.svg
[travis_url]: https://travis-ci.org/mongodb-js/react-d3-component
[npm_img]: https://img.shields.io/npm/v/react-d3-component.svg
[npm_url]: https://npmjs.org/package/react-d3-component
[resuable-charts]: https://bost.ocks.org/mike/chart/
