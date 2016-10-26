/* @flow */
import React, { Component } from "react";
import { renderToString } from 'react-dom/server';

class Dogsled extends Component {
  constructor( props ) {
    super( props );
    this.cache = this.props.cache;
  }

  getChildContext() {
    return {
      cache: this.cache,
    };
  }

  render () {
    return (this.props.children.constructor.name === "Array") ?
      (<div>{this.props.children}</div>) :
      this.props.children ;
  }
}

Dogsled.propTypes = {
  children: React.PropTypes.any,
  cache: React.PropTypes.object,
};

Dogsled.childContextTypes = {
  cache: React.PropTypes.object,
};

export default Dogsled;
