/* @flow */
import LRU from "lru-cache";
import cheerio from "cheerio";
import React from 'react';

function RenderCache(props: {children: Object, cacheKey: Object, update: Boolean, maxAge: Number}, context) {
  const cache = context.cache;
  const { children, cacheKey, update, maxAge } = props;
  if (cache) {
    if (update) {
      if (maxAge) {
        cache.$queue.push([cacheKey, maxAge]);
      } else {
        cache.$queue.push([cacheKey]);
      }
    } else {
      return <div data-dogsled={cacheKey} dangerouslySetInnerHTML={{__html: cache.$lru.get(cacheKey)}}/>;
    }
  }
  return <div data-dogsled={cacheKey}>{children}</div>;
}
RenderCache.contextTypes = {
  cache: React.PropTypes.object
};

class Cache {
  constructor (maxSize:Number, maxAge:Number) {
    this.$lru = LRU({
      max: maxSize || 1000,
      maxAge: maxAge || 1000 * 60 * 60
    });

    this.$queue = [];
  }

  setInitialCss(css:String) {
    if (!this.$css) {
      this.$css = css;
    }
  }

  getCss() {
    return this.$css;
  }

  setHtml(html:String) {
    if (this.$queue.length > 0) {
      const dom = cheerio.load(html, {
        normalizeWhitespace: true,
        xmlMode: true
      });
      while (this.$queue.length > 0) {
        const [cacheKey, maxAge] = this.$queue.shift();
        const item = dom(`[data-dogsled="${cacheKey}"]`);
        if (maxAge) {
          this.$lru.set(cacheKey, item.html(), parseInt(maxAge));
        } else {
          this.$lru.set(cacheKey, item.html());
        }
      }
    }
  }

  renderJSX(
    children: Object,
    key,
    maxAge
  ){
    if (key) {
      if (this.$lru.has(key)) {
        return <RenderCache cacheKey={key} update={false}/>;
      }
      return <RenderCache cacheKey={key} maxAge={maxAge} update={true}>{children}</RenderCache>;
    }
    return <RenderCache cacheKey={key}>{children}</RenderCache>;
  };

  prepareForCache(html:String) {
    // resequence ids
    let seq = 1;
    html = html.replace(/(data-reactid|react-text)(=\"*|:\s*)\d+(\"*)/g,
      (match, p1, p2, p3)=>{ return p1 + p2 + (seq++) + p3; });

    // update checksum
    html = html.replace(/(\s+data-react-checksum=")[^\"]*("\s*)/,
      (match, p1, p2)=>{
        return p1 +
        this.$adler32(html.replace(/\s+data-react-checksum="[^\"]*"\s*/, '')) +
        p2
      }
    );

    return html;
  }

  // stolen from React (for now)
  $adler32(data:String) {
    var a = 1, b = 0, i = 0, l = data.length, m = l & ~0x3;
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
}

export default Cache;
