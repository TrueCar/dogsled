'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function CacheBlock(props, context) {
  var cache = context.cache;
  if (cache) {
    return cache.renderJSX(_react2['default'].createElement(
      'div',
      null,
      props.children
    ), props.cacheKey, props.maxAge);
  }
  return _react2['default'].createElement(
    'div',
    { 'data-dogsled': props.cacheKey },
    _react2['default'].createElement(
      'div',
      null,
      props.children
    )
  );
}


CacheBlock.contextTypes = {
  cache: _react2['default'].PropTypes.object
};

exports['default'] = CacheBlock;
module.exports = exports['default'];
//# sourceMappingURL=CacheBlock.js.map