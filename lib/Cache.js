"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lruCache = require("lru-cache");

var _lruCache2 = _interopRequireDefault(_lruCache);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function RenderCache(props, context) {
  var cache = context.cache;
  var children = props.children,
      cacheKey = props.cacheKey,
      update = props.update,
      maxAge = props.maxAge;

  if (cache) {
    if (update) {
      if (maxAge) {
        cache.$queue.push([cacheKey, maxAge]);
      } else {
        cache.$queue.push([cacheKey]);
      }
    } else {
      return _react2["default"].createElement("div", { "data-dogsled": cacheKey, dangerouslySetInnerHTML: { __html: cache.$lru.get(cacheKey) } });
    }
  }
  return _react2["default"].createElement(
    "div",
    { "data-dogsled": cacheKey },
    children
  );
}
RenderCache.contextTypes = {
  cache: _react2["default"].PropTypes.object
};

var Cache = function () {
  function Cache(maxSize, maxAge) {
    _classCallCheck(this, Cache);

    this.$lru = (0, _lruCache2["default"])({
      max: maxSize || 1000,
      maxAge: maxAge || 1000 * 60 * 60
    });

    this.$queue = [];
  }

  _createClass(Cache, [{
    key: "setInitialCss",
    value: function () {
      function setInitialCss(css) {
        if (!this.$css) {
          this.$css = css;
        }
      }

      return setInitialCss;
    }()
  }, {
    key: "getCss",
    value: function () {
      function getCss() {
        return this.$css;
      }

      return getCss;
    }()
  }, {
    key: "setHtml",
    value: function () {
      function setHtml(html) {
        if (this.$queue.length > 0) {
          var dom = _cheerio2["default"].load(html, {
            normalizeWhitespace: true,
            xmlMode: true
          });
          while (this.$queue.length > 0) {
            var _$queue$shift = this.$queue.shift(),
                _$queue$shift2 = _slicedToArray(_$queue$shift, 2),
                cacheKey = _$queue$shift2[0],
                maxAge = _$queue$shift2[1];

            var item = dom("[data-dogsled=\"" + cacheKey + "\"]");
            if (maxAge) {
              this.$lru.set(cacheKey, item.html(), parseInt(maxAge));
            } else {
              this.$lru.set(cacheKey, item.html());
            }
          }
        }
      }

      return setHtml;
    }()
  }, {
    key: "renderJSX",
    value: function () {
      function renderJSX(children, key, maxAge) {
        if (key) {
          if (this.$lru.has(key)) {
            return _react2["default"].createElement(RenderCache, { cacheKey: key, update: false });
          }
          return _react2["default"].createElement(
            RenderCache,
            { cacheKey: key, maxAge: maxAge, update: true },
            children
          );
        }
        return _react2["default"].createElement(
          RenderCache,
          { cacheKey: key },
          children
        );
      }

      return renderJSX;
    }()
  }, {
    key: "prepareForCache",
    value: function () {
      function prepareForCache(html) {
        var _this = this;

        // resequence ids
        var seq = 1;
        html = html.replace(/(data-reactid|react-text)(=\"*|:\s*)\d+(\"*)/g, function (match, p1, p2, p3) {
          return p1 + p2 + seq++ + p3;
        });

        // update checksum
        html = html.replace(/(\s+data-react-checksum=")[^\"]*("\s*)/, function (match, p1, p2) {
          return p1 + _this.$adler32(html.replace(/\s+data-react-checksum="[^\"]*"\s*/, '')) + p2;
        });

        return html;
      }

      return prepareForCache;
    }()

    // stolen from React (for now)

  }, {
    key: "$adler32",
    value: function () {
      function $adler32(data) {
        var a = 1,
            b = 0,
            i = 0,
            l = data.length,
            m = l & ~0x3;
        while (i < m) {
          var n = Math.min(i + 4096, m);
          for (; i < n; i += 4) {
            b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
          }
          a %= 65521;
          b %= 65521;
        }
        for (; i < l; i++) {
          b += a += data.charCodeAt(i);
        }
        a %= 65521;
        b %= 65521;
        return a | b << 16;
      }

      return $adler32;
    }()
  }]);

  return Cache;
}();

exports["default"] = Cache;
module.exports = exports["default"];
//# sourceMappingURL=Cache.js.map