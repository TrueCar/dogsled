"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _server = require("react-dom/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dogsled = function (_Component) {
  _inherits(Dogsled, _Component);

  function Dogsled(props) {
    _classCallCheck(this, Dogsled);

    var _this = _possibleConstructorReturn(this, (Dogsled.__proto__ || Object.getPrototypeOf(Dogsled)).call(this, props));

    _this.cache = _this.props.cache;
    return _this;
  }

  _createClass(Dogsled, [{
    key: "getChildContext",
    value: function () {
      function getChildContext() {
        return {
          cache: this.cache
        };
      }

      return getChildContext;
    }()
  }, {
    key: "render",
    value: function () {
      function render() {
        return this.props.children.constructor.name === "Array" ? _react2["default"].createElement(
          "div",
          null,
          this.props.children
        ) : this.props.children;
      }

      return render;
    }()
  }]);

  return Dogsled;
}(_react.Component);

Dogsled.propTypes = {
  children: _react2["default"].PropTypes.any,
  cache: _react2["default"].PropTypes.object
};

Dogsled.childContextTypes = {
  cache: _react2["default"].PropTypes.object
};

exports["default"] = Dogsled;
module.exports = exports["default"];
//# sourceMappingURL=Dogsled.js.map