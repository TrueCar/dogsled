import React from 'react';
import { mount, shallow } from 'enzyme';
import {expect} from 'chai';

import LRU from "lru-cache";
import sleep from "sleep";
import { Cache, Dogsled, CacheBlock } from '../lib/';

describe('Cache()', () =>{
  it('should have a default LRU initialized', () => {
    const wrapper = new Cache();
    expect (wrapper.$lru).to.be.instanceof(LRU);
  });
  it('should have an empty queue', () => {
    const wrapper = new Cache();
    expect (wrapper.$queue).to.be.instanceof(Array);
    expect (wrapper.$queue.length).to.be.equal(0);
  });
  it('should hold 1,000 items by default, no more, no less', () => {
    const wrapper = new Cache();
    for (let i=0; i<1001; i++) {
      wrapper.$lru.set(i,i);
    }
    expect (wrapper.$lru.peek(0)).to.be.undefined;
    expect (wrapper.$lru.has(1000)).to.be.true;
    expect (wrapper.$lru.length).to.be.equal(1000);
  });
  it('things should expire after maxAge', () => {
    const wrapper = new Cache(1000, 999);
    for (let i=0; i<1000; i++) {
      wrapper.$lru.set(i,i);
    }
    sleep.usleep(500000);
    wrapper.$lru.prune();
    expect (wrapper.$lru.length).to.be.equal(1000);
    sleep.usleep(500000);
    wrapper.$lru.prune();
    expect (wrapper.$lru.length).to.be.equal(0);
  });
  it('things should be able to have a smaller cache', () => {
    const wrapper = new Cache(500);
    for (let i=0; i<2000; i++) {
      wrapper.$lru.set(i,i);
    }
    expect (wrapper.$lru.length).to.be.equal(500);
  });
  it('things should be able to have a larger cache', () => {
    const wrapper = new Cache(1500);
    for (let i=0; i<2000; i++) {
      wrapper.$lru.set(i,i);
    }
    expect (wrapper.$lru.length).to.be.equal(1500);
  });
});

describe('<Dogsled>...</Dogsled>', () => {
  const cache = new Cache(2, 1000);

  const testDogsled = (cache, jsx) => {
    const wrapper = mount(
      <Dogsled cache={cache}>
        {jsx}
      </Dogsled>
    );
    const html = cache.prepareForCache(wrapper.html());
    cache.setHtml(html);

    return wrapper;
  }

  let x=0;

  const block1a = testDogsled(cache,
    <CacheBlock cacheKey="block1">
      <p>{x++}</p>
    </CacheBlock>
  );

  const block1b = testDogsled(cache,
    <CacheBlock cacheKey="block1">
      <p>{x++}</p>
    </CacheBlock>
  );

  const block2a = testDogsled(cache,
    <CacheBlock cacheKey="block2">
      <p>{x++}</p>
    </CacheBlock>
  );

  const block2b = testDogsled(cache,
    <CacheBlock cacheKey="block2">
    <p>{x++}</p>
    </CacheBlock>
  );

  const block2c = testDogsled(cache,
    <CacheBlock cacheKey="block2">
    <p>{x++}</p>
    </CacheBlock>
  );

  it('cached content should be identical for the same key', () => {
    expect (block1a.html()).to.be.equal(block1b.html());
  });
  it('cached content should be different for different keys', () => {
    expect (block1a.html()).to.be.not.equal(block2a.html());
  });

  const block3a = testDogsled(cache,
    <CacheBlock cacheKey="block3">
      <p>{x++}</p>
    </CacheBlock>
  );

  const block3b = testDogsled(cache,
    <CacheBlock cacheKey="block3">
    <p>{x++}</p>
    </CacheBlock>
  );

  const block1c = testDogsled(cache,
    <CacheBlock cacheKey="block1">
    <p>{x++}</p>
    </CacheBlock>
  );

  it('adding more should expire less used cache items', () => {
    expect (cache.$lru.length).to.be.equal(2);
  });
  it('deleted cache content should not match old content', () => {
    expect (block1a.html()).to.be.not.equal(block1c.html());
  });

  it('expired cache content should not match old content', () => {
    sleep.usleep(1000000);
    cache.$lru.prune();

    const block1d = testDogsled(cache,
      <CacheBlock cacheKey="block1">
      <p>{x++}</p>
      </CacheBlock>
    );

    expect (block1c.html()).to.be.not.equal(block1d.html());
  });

});
