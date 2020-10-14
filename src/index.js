
/**
    * Install the inline injector manager for the Embed Tool
    *
    * @Note this has to be triggered after await editor.isReady.
    * @usage Paste a html link outside the editor
    * @author sos-productions.com
    * @version 4.0
    * @history
    *    1.0 (02.09.2020) - Initial version from SoSIE
    *    1.1 (04.09.2020) - Error message improved
    *    1.2 (06.09.2020) - Register added
    *    1.3 (07.09.2020) - Interactive
    *    2.0 (17.09.2020) - Date and version fixed
    *    3.0 (10.10.2020) - Wrap into a Class EmbedPlugin
    *    4.0 (14.10.2020) - Caret save and restore so now inline injections works with injector with an advanced interactive demo
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
             * @param {Number} index - block's index specifying in which block to inject
             * @param {number} caret - at the postion of the caret 
             */
            function injectEmbedByUrl(url, mode, data, api, config, index, caret) {
                
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
                    const blockEmbed = new Embed({
                    data: data,
                    api: api
                    })

                    // Kept info, does work here as blocks are div no textarea
                    // I ignore if it works , not tested
                    function setCaretPositionTextarea(el, caretPos) {

                      el.value = el.value;
                      // ^ this is used to not only get "focus", but
                      // to make sure we don't have it everything -selected-
                      // (it causes an issue in chrome, and having it doesn't hurt any other browser)

                      if (el !== null) {

                          if (el.createTextRange) {
                              var range = el.createTextRange();
                              range.move('character', caretPos);
                              range.select();
                              return true;
                          } else {
                              // (el.selectionStart === 0 added for Firefox bug)
                              if (el.selectionStart || el.selectionStart === 0) {
                                  el.focus();
                                  el.setSelectionRange(caretPos, caretPos);
                                  return true;
                              }

                              else  { // fail city, fortunately this never happens (as far as I've tested) :)
                                  el.focus();
                                  return false;
                              }
                          }
                      }
                  }
                    
                    console.log('Insert Block at index block ' + index + ' and caret ' + caret + ' in mode ' + mode);

                    if (mode == 'inline') {
                      
                      // Restore the caret cursor that has been lost 
                      // when the Embed panel has been opened
                      Block.setCaretPosition(index, caret);
                      
                      // Inject blockEmbed at the current caret position
                      var blockElement=blockEmbed.render();
                      Block.inlineInjector(blockElement);
                    
                    } else {// mode block
                      
                      api.blocks.insert('embed', data, config, index, true);
                    
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
            * 
            * @param {number} caret - at the postion of the caret 
            */
            editor.inject.Embed = (mode, data, api, config, interactive, index, caret) => {
                
                    
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
                         console.log('Inject using config',config)
                         injectEmbedByUrl(sample.url, sample.mode, {
                            source: sample.url,
                            caption: sample.title
                          }, api, config, index, caret);
                      }
                        
                      notifier.show({
                        type:'demo',
                        title:'Welcome to the Url Embed injector interactive demo',
                        message:'Type your url ',
                        id:'embed',
                        layout:'left,bottom',
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
                            custom:true,
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
                            injectEmbedByUrl(url, mode, data, api, config, index, caret);
                    }
                      
                } else {
                    
                    injectEmbedByUrl(url, mode, data, api, config, index, caret);
                    
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

     // Saved api.blocks.getCurrentBlockIndex() + 1
    let position = document.getElementById('currentPosition').value;
    let index = position - 1;
    
    let caret=editor.clipboard.blockSelection.in;
    
    editor.inject.Embed(mode || 'inline', {
      source: url,
      caption: caption
    },
    editor,
    config,
    interactive,
    index,
    caret
    )
}



//Register so SoSIe will autoinit.    
SoSIE.register('EmbedPlug');
    
