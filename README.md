# Dogsled
## Server-side JSX block render caching for React applications

This component set provides server-side caching of rendered JSX.  It allows
relatively static content to be cached and served to multiple sessions.

## Installation

TBD

## Dependencies

* [react](https://www.npmjs.com/package/react)
* [react-dom](https://www.npmjs.com/package/react-dom)
* [cheerio](https://www.npmjs.com/package/cheerio)
* [lru-cache](https://www.npmjs.com/package/lru-cache)

## Usage

In your primary node server, you'll need to import the Cache class:

```js
import { Cache } from "dogsled";
```

If you are using Aphrodite (or some other pre-rendering solution), you'll need
to have code similiar to:

```js
const cache = new Cache();

var {html, css} = StyleSheetServer.renderStatic(() => {
  return renderToString(<App cache={cache}/>);
});

html = cache.prepareForCache(html);

cache.setInitialCss(css.content);
cache.setHtml(html);
```

Ultimately, this is passed to the client with something like:

```js
  res.end(`
    <html>
        <head>
            <style data-aphrodite>${cache.getCss()}</style>
        </head>
        <body>
            <div id="root">${html}</div>
            <script src="./build.js"></script>
            <script>
              window.onload = function() {
                ClientApp.rehydrate(${JSON.stringify(css.renderedClassNames)});
              };
            </script>
        </body>
    </html>
  `);
```


Without Aphrodite, you can simplify the code with:

```js
const cache = new Cache();
const html = cache.prepareForCache(renderToString(<App cache={cache}/>));
cache.setHtml(html);
```

It is important to note that the cache is path, page, or application specific.  Each distinct page should utilize its own Cache object.


### Cache object

The `Cache` object can be instantiated with two optional parameters:

* `maxSize` (optional) - the maximum number of items to store in the cache
* `maxAge` (optional) - the maximum cache age of the stored content in milliseconds.

The Cache object has 4 public methods:

* `setInitialCss(css)`
* `setHtml(html)`
* `getCSS()`
* `prepareForCache(html)`

From top to bottom, these represent the storage, sanitizing, and output of the caching engine.

`setItitialCss` is passed a single parameter for the pages default css.  Since libraries like Aphrodite only render css that is present in the JSX, cached objects will not have their css rendered on subsequent page renders.  This ensures that the client receives the full css for the page, regardless of what has been cached.

`setHtml` takes a single parameter of the raw HTML and sends it to the caching engine, rendering in into an off-screen DOM, and extracting the sections that have been tagged for caching with the `<CacheBlock/>` component.

`getCss` retrieves the stored static css for the page.

`prepareForCache` sanitizes the html that is passed to it in a paramenter, resequencing React IDs as needed, and updating the checksum.  This needs to be done particularly with injected cached content, otherwise React will complain.

### Use in Components


In your components, you'll need to import `Dogsled` and `CacheBlock` with:

```js
import { Dogsled, CacheBlock } from "dogsled";
```

Outside of all of the cached content on the page, you'll need to add `Dogsled`
to the JSX with:

```jsx
<Dogsled cache={props.cache}>
  ...
</Dogsled>
```

Then, inside you can add the `CacheBlock` to content you want to have cached:

```jsx
<Dogsled cache={props.cache}>
  ...
  <CacheBlock cacheKey="a-unique-key-name">
    <ReallyComplexComponentThatIsCommonToAllVisitors />
  </CacheBlock>
  ...
  <CacheBlock cacheKey="another-unique-key-name" maxAge={1000*60*60}>
    <MaybeANewsTickerThatUpdatesHourly />
  </CacheBlock>
  ...
</Dogsled>
```

The `Dogsled` component takes a single property:

* `cache` (required) - the `Cache` object instantiated in the main server application

The `CacheBlock` component takes a couple properties:

* `cacheKey` (required) - a unique string
* `maxAge` (optional) - the maximum cache age of the stored content in milliseconds.

And both have `children`, obviously.

## Known Issues

* Empty `<div>` tags cannot be cached.  These are currently getting mangled and will cause a html rendering warning in React.  This includes: `<div/>` and `<div></div>` formats.
* &-entities cannot be cached.  JSX that produces HTML entities such as `&nbsp;` or `&amp;` and so on cause problems because of the rendering pipeline.
 
