
//import './sosie.css'

/**
    * Install the inline injector manager for the Embed Tool
    *
    * @Note this has to be triggered after await editor.isReady.
    * @usage Paste a html link outside the editor
    * @author sos-productions.com
    * @version 1.1
    * @history
    *    1.0 (02.10.2020) - Initial version from SoSIE
    *    1.1 (04.10.2020) - Error message improved
    * @property {Object} editor - Editor.js API
    **/
Embed.init = (editor) => {
  if (!('inject' in editor)) editor.inject = {}

  if (!('Embed' in editor.inject)) {
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
            * Inline injector manager for the Embed Tool
            * @note Atttemp to solves issues;
            *   Embed as new block (https://github.com/editor-js/embed/issues/36)
            *   How to insert() embed programmatically? (https://github.com/editor-js/embed/issues/16)
            *   Embed not visible in toolbox (https://github.com/editor-js/embed/issues/16)
            * @property {string} mode - set to inline for inline injection, else block
            * @property {Object} api - Editor.js API
            * @property {EmbedData} data - private property with Embed data
            * @property {Object} config - config of the services for the tool Embed
            */
    editor.inject.Embed = (mode, data, api, config) => {
      Embed.prepare({
        config: config
      })

      const services = Embed.services
      const servicesEntries = Object.entries(services)

      const {
        patterns
      } = Embed.pasteConfig

      const url = prompt('Try your url', data.source)

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
          const index = (Number.isFinite(mode)) ? mode : api.blocks.getCurrentBlockIndex() + 1
          api.blocks.insert('embed', data, config, index, true)
        }
      } else if (url) {
        alert('No service for this url, check your services config ;\nfor now only ' + servicesName.join(',') + ' are enabled')
      }
    }
  }
}

/**
    * Helper that may hold user services config
    *
    * @property {string} url - source URL of embedded content
    * @property {string} embed - URL to source embed page
    * @property {string} caption - content caption
    * @property {string} [mode] - default is set tyo 'inline'
    * @property {boolean} [custom] - if true, uses userServices config stored in this Helper
    */
function injectEmbed (url, caption, mode, custom) {
    
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
    config
    )
}
