![](https://badgen.net/badge/SoS正/0.8.0/f2a) ![](https://badgen.net/badge/editor.js/v2.1.9/blue) ![](https://badgen.net/badge/plugin/v4.0.0/orange) 

# Embed Plugin to init the Embed Tool of editor.js

## What's news Doc ?

- Since 4.0.0, the Plugin depends on Block Plugin 2.0.0+, injector and more have been deported there
and caret selection handled correctly when Embed Injector panel is used.

## Feature(s)

### Embed init helper

Provides Embed.init() to initialise Embed tool just after editor isready.

### inline/block injection manager

```js
/**
    * Embed Block Helper that may hold user services config
    *
    * @property {string} url - source URL of embedded content
    * @property [string|boolean} interactive - if a string is specified, use this for prompt else default if boolean is true. Default is no interactivity 
    * @property {string} caption - content caption
    * @property {string} [mode] - default is set tyo 'inline'
    * @property {boolean} [custom] - if true, uses userServices config stored in this Helper
    */
injectEmbed (url, interactive, caption, mode, custom) 
```
## Integration

Let take the example file of the codex [editor.js](https://github.com/codex-team/editor.js/tree/next/example)

1) Read and follow the procedure builing [here](https://editorjs.io/core-development) , github source
of the embed plugin (and other) will be downloaded in editor.js/example/tools.

2) Add a line in 

a)either you example.html

```html
    <script src="editor.js/plugins/embed/dist/bundle.js"></script>
```
b)or your editor.js/example-dev.html

```html
    <script src="editor.js/plugins/embed/src/index.js"></script>
```
3) Update SoS正 / editor.js core, sosie.js

```js
     /**
     * Initialise editor and plugins
     * 
     * @param {EditorJS} editor - editor js instance
     */
     init(editor) {
          
        //--- Now it is time to init SoSie's plugins, which are init helper for tools ---
        
        //This will attach bunny's injector so we will be able
        //to plants carots where we want in the field of Blocks.
        //inside in the text where cursor has been positionned (inline mode) 
        //or after current selected block (block mode)
        Embed.init(editor);
        
        //--------------------------------------------------------------------------------
              
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
