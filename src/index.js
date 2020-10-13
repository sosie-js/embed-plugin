
/**
    * Install the inline injector manager for the Embed Tool
    *
    * @Note this has to be triggered after await editor.isReady.
    * @usage Paste a html link outside the editor
    * @author sos-productions.com
    * @version 3.0
    * @history
    *    1.0 (02.09.2020) - Initial version from SoSIE
    *    1.1 (04.09.2020) - Error message improved
    *    1.2 (06.09.2020) - Register added
    *    1.3 (07.09.2020) - Interactive
    *    2.0 (17.09.2020) - Date and version fixed
    *    3.0 (10.10.2020) - Wrap into a Class EmbedPlugin
    * @property {Object} editor - Editor.js API
    **/



/**
 * Embed plugin
 *
 * @typedef {Object} EmbedPlugin
 * @description EmbedPlugin will be intiatlised not in the constructor but lately with .init(editor)
 * called indiretly SoSIE when Editor and Menubar dom are both available
 */
class EmbedPlugin {
        
    constructor() {}
    
    init(editor) {
            
        console.log("Embed init plugin starts");
            
        if (!('inject' in editor)) editor.inject = {}

        if (!('Embed' in editor.inject)) {
            
            console.log("Embed init plugin : install editor.inject.Embed");
            
            /**
            * @typedef {Object} EmbedData
            * @description Embed Tool data
            * @property {string} service - service name
            * @property {string} url - source URL of embedded content
            * @property {string} embed - URL to source embed page
            * @property {number} [width] - embedded content width
            * @property {number} [height] - embedded content height
            * @property {string} [caption] - content caption
            */

            /**
             * Embed Injector core 
             *
             * @param {String} url
             * @param {string} mode - set to inline for inline injection, else block
             * @param {Object} api - Editor.js API
             * @param {EmbedData} data - private property with Embed data
             * @param {Object} config - config of the services for the tool Embed
             */
            function injectEmbedByUrl(url, mode, data, api, config) {
                
                Embed.prepare({
                    config: config
                })

                const services = Embed.services
                const servicesEntries = Object.entries(services)

                const {
                    patterns
                } = Embed.pasteConfig
                
                   // Determine the name ot the service from the url
                const found = false
                const serviceFound = ''
                let serviceName = ''
                const servicesName = Object.keys(services)
                let s = 0
                const sMax = servicesName.length

                while ((!serviceName) && (s < sMax)) {
                    if (patterns[servicesName[s]].test(url)) {
                    serviceName = servicesName[s]
                    }
                    s = s + 1
                }

                if (url && serviceName) {
                    const service = services[serviceName]

                    // Resolves embed like with Embed.onPaste()
                    const {
                    regex,
                    embedUrl,
                    width,
                    height,
                    id = (ids) => ids.shift()
                    } = service

                    const result = regex.exec(url).slice(1)
                    const embed = embedUrl.replace(/<\%\= remote\_id \%\>/g, id(result))
                    const caption = data.caption || ''

                    // Now data is complete, for now dims are not handled on embed tool
                    data = {
                    service: serviceName,
                    source: url,
                    embed,
                    width,
                    height,
                    caption
                    }

                    // Build the embed block and fill in with data
                    const Block = new Embed({
                    data: data,
                    api: api
                    })

                    // Helper to inject the Embed block inline at the start on selection
                    // ie in selection place, no need to hiligh some chars to make inline tools appears
                    // this is triggered externally by clicking on a menu bar button
                    function blockInlineInjector (toolBlock) {
                    const sel = window.getSelection()
                    const range = sel.getRangeAt(0)
                    range.insertNode(toolBlock.render())
                    }

                    if (mode == 'inline') {
                    // here we assume the cursor is inside a block after a click
                    blockInlineInjector(Block)
                    } else {
                    // mode block
                    //console.log('API',api);
                    const index = (Number.isFinite(mode)) ? mode : api.blocks.getCurrentBlockIndex() + 1
                    api.blocks.insert('embed', data, config, index, true)
                    }
                } else if (url) {
                    alert('No service for this url, check your services config ;\nfor now only ' + servicesName.join(',') + ' are enabled')
                }
            }
            
            
            /**
            * Helper for making Elements with attributes
            *
            * @param  {string} tagName           - new Element tag name
            * @param  {array|string} classNames  - list or name of CSS classname(s)
            * @param  {Object} attributes        - any attributes
            * @return {Element}
            */
            function _make(tagName, classNames, attributes) {
                
                let el = document.createElement(tagName);

                if ( Array.isArray(classNames) ) {
                    el.classList.add(...classNames);
                } else if( classNames ) {
                    el.classList.add(classNames);
                }

                for (let attrName in attributes) {
                    if(((attrName == 'disabled')||(attrName == 'readonly')) && attributes[attrName])  {
                        el.setAttribute(attrName,attrName);
                    } else {
                       // if(attrName == 'value') el[attrName] = attributes[attrName];
                        el.setAttribute(attrName,attributes[attrName]);
                    }
                }

                return el;
            }
            
            
            /**
            * Inline injector manager for the Embed Tool
            * @note Atttemp to solves issues;
            *   Embed as new block (https://github.com/editor-js/embed/issues/36)
            *   How to insert() embed programmatically? (https://github.com/editor-js/embed/issues/16)
            *   Embed not visible in toolbox (https://github.com/editor-js/embed/issues/16)
            * @param {string} mode - set to inline for inline injection, else block
            * @param {Object} api - Editor.js API
            * @param {EmbedData} data - private property with Embed data
            * @param {Object} config - config of the services for the tool Embed
            * @param [string|boolean} interactive - if a string is specified, use this for prompt else default if boolean is true. Default is no interactivity
            */
            editor.inject.Embed = (mode, data, api, config, interactive) => {
                
                    
                let url = data.source;
                
                if(interactive) {
                 
                    if(notifier) {
                        
                      function reject(message) {
                         notifier.show({
                            message: message,
                            layout: 'middle',
                            style: 'error',
                            time: 2000
                          })
                      }
                      
                      function resolve(sample) {
                         injectEmbedByUrl(sample.url, sample.mode, {
                            source: sample.url,
                            caption: sample.title
                          }, api, config);
                      }
                      
                      notifier.show({
                        type:'demo',
                        title:'Welcome to the Url Embed injector interactive demo',
                        message:'Type your url ',
                        id:'embed',
                        url:'', //default
                        placeholder:'your url',
                        okHandler: function(sample) {
                          resolve(sample);
                        },
                        emptyHandler: function() {
                          reject('Sorry but url can not be empty, aborting');
                        },
                        cancelHandler: function() {
                          reject('Cancelled');
                        },
                        samples:[
                          {
                            type:'injectbtn',
                            interactive:false,
                            url:'http://sos-productions.com/7',
                            mode:'inline',
                            custom:'true',
                            title:"I am SoSIE, here are lucky people behind the flags click on it!",
                            text:"Bunny gift"
                          },{
                            type:'injectbtn',
                            interactive:false,
                            url:'https://vimeo.com/357871593',
                            mode:'block',
                            custom:false,
                            title:"COMING FOR YOU - Based on a True Story That Affected 100 Million People",
                            text:"Coming 4U"
                          },{
                            type:'injectbtn',
                            interactive:false,
                            url:'https://youtu.be/E8q2kdTeGzo',
                            mode:'block',
                            custom:false,
                            title:"Eternal Fifty Minutes | Coming for You II",
                            text:"Eternal 50mn"
                          },{
                            type:"injectbtn",
                            interactive:false,
                            url:"https://www.youtube.com/watch?v=Mg5budPRY1Q",
                            mode:"block",
                            custom:false,
                            title:"'Claws of the Red Dragon' exposes connection between Huawei and CCP",
                            text:"ClawsRedDragon"
                          }
                        ]
                      });    
                      
                    }else {
                        if(typeof interactive == 'boolean') {
                            url=prompt('Try your url', url);
                        } else {
                            url=prompt(interactive, url);
                        }
                        if(url)
                            injectEmbedByUrl(url, mode, data, api, config);
                    }
                      
                      
                      
                    
                } else {
                    
                    injectEmbedByUrl(url, mode, data, api, config);
                    
                }

             
            }
        }
        
        console.log("Embed init plugin end");
    }
}


var EmbedPlug = new EmbedPlugin();
EmbedPlug.init(editor);


/**
    * Helper that may hold user services config
    *
    * @property {string} url - source URL of embedded content
    * @property {string} embed - URL to source embed page
    * @property {string} caption - content caption
    * @property {string} [mode] - default is set tyo 'inline'
    * @property {boolean} [custom] - if true, uses userServices config stored in this Helper
    */
function injectEmbed (url, interactive, caption, mode, custom) {
    
    let config = Embed.pasteConfig
    if (custom) {
      // Dummy bunny example,don't forget to greet SoSie who has bunny id 7 by injecting http://sos-productions.com/7
      // Overrides global config set in editor.config.tools.embed.config,
      // see services.js in plugin Embed for awailaible services name list,
      // activate the service 'serviceName' here by adding a line with serviceName:true
      config = {
        services: {
          youtube: true,
          vimeo: true,
          bunny: {
            regex: /https?:\/\/sos-productions.com\/([0-9]+)/,
            embedUrl: 'http://sos-productions.com/share/bunny/index.php?id=<%= remote_id %>#hello',
            html: "<iframe height='640' scrolling='no' frameborder='no' style='width: 100%;'></iframe>",
            height: 800,
            width: 640
          }
        }
      }
    }

    editor.inject.Embed(mode || 'inline', {
      source: url,
      caption: caption
    },
    editor,
    config,
    interactive
    )
}



//Register so SoSIe will autoinit.    
SoSIE.register('EmbedPlug');
    
