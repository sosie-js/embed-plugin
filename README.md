![](https://badgen.net/badge/SoS正/Beta/f2a) ![](https://badgen.net/badge/editor.js/v2.0/blue) ![](https://badgen.net/badge/plugin/v1.0/orange) 

# Embed Plugin to init the Embed Tool of editor.js

## Feature(s)

### Embed init helper

Provides Embed.init() to initialise Embed tool just after editor isready.

### inline/block injection manager

```js
/**
    * Helper that may hold user services config
    *
    * @property {string} url - source URL of embedded content
    * @property {string} embed - URL to source embed page
    * @property {string} caption - content caption
    * @property {string} [mode] - default is set tyo 'inline'
    * @property {boolean} [custom] - if true, uses userServices config stored in this Helper
    */
injectEmbed (url, caption, mode, custom) 
```
## Integration

1) Add a line in 

a)either you example.html

```html
    <script src="editor.js/plugins/embed/dist/bundle.js"></script>
```
b)or your exmaple-dev.html

```html
    <script src="editor.js/plugins/embed/src/index.js"></script>
```
2) Update SoS正 / editor.js core

```js
```


## Building the plugin

To produce the dist/bundle.js for production use the command: 

```shell
yarn build
```

## Wants a demo?

[live](http://sosie.sos-productions.com/)
