function injectEmbed(e,t,i,n){editor.then((function(o){let r=Embed.pasteConfig;n&&(r={services:{youtube:!0,vimeo:!0,bunny:{regex:/https?:\/\/sos-productions.com\/([0-9]+)/,embedUrl:"http://sos-productions.com/share/bunny/index.php?id=<%= remote_id %>#hello",html:"<iframe height='640' scrolling='no' frameborder='no' style='width: 100%;'></iframe>",height:800,width:640}}}),o.inject.Embed(i||"inline",{source:e,caption:t},o,r)}))}Embed.init=e=>{"inject"in e||(e.inject={}),"Embed"in e.inject||(e.inject.Embed=(e,t,i,n)=>{Embed.prepare({config:n});const o=Embed.services,{patterns:r}=(Object.entries(o),Embed.pasteConfig),c=prompt("Try your url",t.source);let s="";const d=Object.keys(o);let l=0;const m=d.length;for(;!s&&l<m;)r[d[l]].test(c)&&(s=d[l]),l+=1;if(c&&s){const r=o[s],{regex:d,embedUrl:l,width:m,height:h,id:a=(e=>e.shift())}=r,p=d.exec(c).slice(1);t={service:s,source:c,embed:l.replace(/<\%\= remote\_id \%\>/g,a(p)),width:m,height:h,caption:t.caption||""};const g=new Embed({data:t,api:i});if("inline"==e)b=g,window.getSelection().getRangeAt(0).insertNode(b.render());else{const o=Number.isFinite(e)?e:i.blocks.getCurrentBlockIndex()+1;i.blocks.insert("embed",t,n,o,!0)}}else c&&alert("No service for this url, check your services config ;\nfor now only "+d.join(",")+" are enabled");var b})};