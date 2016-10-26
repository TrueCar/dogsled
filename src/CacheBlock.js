/* @flow */
import React from 'react';

function CacheBlock(props : { children : $React$Children, cacheKey : String, maxAge: Number }, context) {
  const cache = context.cache;
  if (cache) {
    return cache.renderJSX(<div>{props.children}</div>, props.cacheKey, props.maxAge);
  }
  return <div data-dogsled={props.cacheKey}><div>{props.children}</div></div>;
}

CacheBlock.contextTypes = {
  cache: React.PropTypes.object
};

export default CacheBlock;
