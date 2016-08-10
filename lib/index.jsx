const React = require('react');
const ReactDOM = require('react-dom');
const d3 = require('d3-selection');
const assign = require('lodash.assign');

const D3Component = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    renderMode: React.PropTypes.oneOf(['svg', 'div']),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    d3fn: React.PropTypes.func.isRequired
  },

  /**
   * returns default props.
   *
   * @return {Object}   Default props for the optional props.
   */
  getDefaultProps() {
    return {
      renderMode: 'svg',
      width: 400,
      height: 300
    };
  },

  /**
   * returns the initial state, where `chart` is set to null.
   * @return {Object}    default state.
   */
  getInitialState() {
    return {
      chart: null
    };
  },

  /**
   * executed once after Component mounted. Call the outer d3 function to
   * set up the chart, and bind the inner function to `this.state.chart`.
   */
  componentWillMount() {
    this.setState({
      chart: this.props.d3fn()
    });
  },

  /**
   * tell d3 code to draw content after mounting the component.
   */
  componentDidMount: function() {
    this._redraw();
  },

  /**
   * tell d3 code to redraw content when component updated.
   */
  componentDidUpdate() {
    this._redraw();
  },

  /**
   * return the correct container depending on renderMode: <svg> or <div>.
   *
   * For <div> container, the width and height are set via inline styles.
   * For <svg> container, the width and height are set directly as properties.
   *
   * @return {Component}  the empty container component into which d3 can render.
   */
  _createContainer() {
    let options = {
      ref: 'container'
    };
    const sizeOptions = {
      width: this.props.width,
      height: this.props.height
    };
    if (this.props.renderMode === 'svg') {
      options = assign(options, sizeOptions);
      return <svg {...options}></svg>;
    }
    options = assign(options, {
      style: sizeOptions
    });
    return <div {...options}></div>;
  },

  /**
   * Get the container (via reference), update width and height, then
   * bind new data and call the inner d3 function to (re-)draw the chart.
   */
  _redraw() {
    const el = ReactDOM.findDOMNode(this.refs.container);

    this.state.chart
      .width(this.props.width)
      .height(this.props.height);

    d3.select(el)
      .datum(this.props.data)
      .call(this.state.chart);
  },

  /**
   * Render the empty container only. Everything inside the container is
   * the responsibility of the d3 code.
   *
   * @return {Component}  the container component wrapped inside a div.
   */
  render() {
    const container = this._createContainer();
    return (
      <div ref="wrapper">
        {container}
      </div>
    );
  }
});

module.exports = D3Component;
