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
2) Update SoS正 / editor.js core, sosie.js

```js
    /**
     * Initialise editor and plugins
     * 
     * @param {EditorJS} editor - editor js instance
     */
     async init(editor) {
          
            try {
    
                await editor.isReady;

                //--- Now it is time to init SoSie's plugins, which are init helper for tools ---
                
                //This will attach bunny's injector so we will be able
                //to plants carots where we want in the field of Blocks.
                //inside in the text where cursor has been positionned (inline mode) 
                //or after current selected block (block mode)
                Embed.init(editor);
                
                //--------------------------------------------------------------------------------
            
            } catch (reason) {
                console.log(reason);
                console.warn(`SoSIE editor initialization failed because of ${reason}`)
            }
            
            return editor;
     }
```

## Building the plugin

To produce the dist/bundle.js for production use the command: 

```shell
yarn build
```

## Missing something?

[A demo please SoSie](http://sosie.sos-productions.com/)
