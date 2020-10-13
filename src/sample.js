/**
    * Sample of buttons for the Embed
    *
    * @property {boolean} [custom] - if true, uses userServices config stored in this Helper
    */
function sampleEmbedPlug(editor) {
 
    if(editor.hasOwnProperty('sosie')) { 
    
        let sosie=editor.sosie;
        
     /*   //  Inline injection of a block handled by a user service 'notice custom set to true for that).
        sosie.addMenuItemBtn({
            type:'injectbtn',
            interactive:false,
            url:'http://sos-productions.com/7',
            mode:'inline',
            custom:true,
            title:"I am SoSIE, here are lucky people behind the flags click on it!",
            text:"Bunny in line"
        });
        
        // Injection in Block mode, using vimeo service
        sosie.addMenuItemBtn({
            type:'injectbtn',
            interactive:false,
            url:'https://vimeo.com/357871593',
            mode:'block',
            custom:false,
            title:"COMING FOR YOU - Based on a True Story That Affected 100 Million People",
            text:"Coming for you"
        });
        
        // Injection in Block mode,
        sosie.addMenuItemBtn({
            type:'injectbtn',
            interactive:false,
            url:'https://youtu.be/E8q2kdTeGzo',
            mode:'block',
            custom:false,
            title:"Eternal Fifty Minutes | Coming for You II",
            text:"Eternal Fifty Minutes"
        });*/

        // Injection in Block mode,
        sosie.addMenuItemBtn({
            type:'injectbtn',
            caption: "Embed interactive injector",
            url:'',
            mode:'block',
            custom:false,
            title:"Embed injector",
            text:"Injector",
            interactive:'Chooser'
        });
        
    }
}
