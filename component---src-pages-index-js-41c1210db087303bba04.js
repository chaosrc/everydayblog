(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{167:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",function(){return f});var r=a(8),i=a.n(r),n=a(0),o=a.n(n),s=a(168),l=a(175),d=a(172),c=a(173),u=a(169),A=function(e){function t(){return e.apply(this,arguments)||this}return i()(t,e),t.prototype.render=function(){var e=this.props.data,t=e.site.siteMetadata.title,a=e.allMarkdownRemark.edges;return o.a.createElement(d.a,{location:this.props.location,title:t},o.a.createElement(c.a,{title:"All posts"}),o.a.createElement(l.a,null),a.map(function(e){var t=e.node,a=t.frontmatter.title||t.fields.slug;return o.a.createElement("div",{key:t.fields.slug},o.a.createElement("h3",{style:{marginBottom:Object(u.a)(.25)}},o.a.createElement(s.a,{style:{boxShadow:"none"},to:t.fields.slug},a)),o.a.createElement("small",null,t.frontmatter.date),o.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}}))}))},t}(o.a.Component);t.default=A;var f="2785444898"},168:function(e,t,a){"use strict";a.d(t,"b",function(){return u});var r=a(0),i=a.n(r),n=a(5),o=a.n(n),s=a(40),l=a.n(s);a.d(t,"a",function(){return l.a});a(170);var d=i.a.createContext({});function c(e){var t=e.staticQueryData,a=e.data,r=e.query,n=e.render,o=a?a.data:t[r]&&t[r].data;return i.a.createElement(i.a.Fragment,null,o&&n(o),!o&&i.a.createElement("div",null,"Loading (StaticQuery)"))}var u=function(e){var t=e.data,a=e.query,r=e.render,n=e.children;return i.a.createElement(d.Consumer,null,function(e){return i.a.createElement(c,{data:t,query:a,render:r||n,staticQueryData:e})})};u.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},169:function(e,t,a){"use strict";a.d(t,"a",function(){return l}),a.d(t,"b",function(){return d});var r=a(180),i=a.n(r),n=a(181),o=a.n(n);o.a.overrideThemeStyles=function(){return{"a.gatsby-resp-image-link":{boxShadow:"none"}}},delete o.a.googleFonts;var s=new i.a(o.a);var l=s.rhythm,d=s.scale},170:function(e,t,a){var r;e.exports=(r=a(171))&&r.default||r},171:function(e,t,a){"use strict";a.r(t);a(41);var r=a(0),i=a.n(r),n=a(5),o=a.n(n),s=a(64),l=function(e){var t=e.location,a=e.pageResources;return a?i.a.createElement(s.a,Object.assign({location:t,pageResources:a},a.json)):null};l.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=l},172:function(e,t,a){"use strict";a(41);var r=a(8),i=a.n(r),n=a(0),o=a.n(n),s=a(168),l=a(169),d=function(e){function t(){return e.apply(this,arguments)||this}return i()(t,e),t.prototype.render=function(){var e,t=this.props,a=t.location,r=t.title,i=t.children;return e="/everydayblog/"===a.pathname?o.a.createElement("h1",{style:Object.assign({},Object(l.b)(1.5),{marginBottom:Object(l.a)(1.5),marginTop:0})},o.a.createElement(s.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},r)):o.a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0}},o.a.createElement(s.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},r)),o.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(l.a)(24),padding:Object(l.a)(1.5)+" "+Object(l.a)(.75)}},o.a.createElement("header",null,e),o.a.createElement("main",null,i),o.a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",o.a.createElement("a",{href:"https://www.gatsbyjs.org"},"Gatsby")))},t}(o.a.Component);t.a=d},173:function(e,t,a){"use strict";var r=a(174),i=a(0),n=a.n(i),o=a(5),s=a.n(o),l=a(182),d=a.n(l);function c(e){var t=e.description,a=e.lang,i=e.meta,o=e.title,s=r.data.site,l=t||s.siteMetadata.description;return n.a.createElement(d.a,{htmlAttributes:{lang:a},title:o,titleTemplate:"%s | "+s.siteMetadata.title,meta:[{name:"description",content:l},{property:"og:title",content:o},{property:"og:description",content:l},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:s.siteMetadata.author},{name:"twitter:title",content:o},{name:"twitter:description",content:l}].concat(i)})}c.defaultProps={lang:"en",meta:[],description:""},c.propTypes={description:s.a.string,lang:s.a.string,meta:s.a.arrayOf(s.a.object),title:s.a.string.isRequired},t.a=c},174:function(e){e.exports={data:{site:{siteMetadata:{title:"温故而知新",description:"个人博客, 坚持每天一篇！",author:"chao"}}}}},175:function(e,t,a){"use strict";a(176);var r=a(178),i=a(0),n=a.n(i),o=a(168),s=a(179),l=a.n(s),d=a(169);var c="4007731267";t.a=function(){return n.a.createElement(o.b,{query:c,render:function(e){var t=e.site.siteMetadata,a=t.author;return t.social,n.a.createElement("div",{style:{display:"flex",marginBottom:Object(d.a)(2.5)}},n.a.createElement(l.a,{fixed:e.avatar.childImageSharp.fixed,alt:a,style:{marginRight:Object(d.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),n.a.createElement("p",null,"个人博客 ",n.a.createElement("br",null),"每天坚持✊"))},data:r})}},176:function(e,t,a){"use strict";a(177)("fixed",function(e){return function(){return e(this,"tt","","")}})},177:function(e,t,a){var r=a(9),i=a(12),n=a(25),o=/"/g,s=function(e,t,a,r){var i=String(n(e)),s="<"+t;return""!==a&&(s+=" "+a+'="'+String(r).replace(o,"&quot;")+'"'),s+">"+i+"</"+t+">"};e.exports=function(e,t){var a={};a[e]=t(s),r(r.P+r.F*i(function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3}),"String",a)}},178:function(e){e.exports={data:{avatar:{childImageSharp:{fixed:{base64:"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAQCAQP/xAAXAQEBAQEAAAAAAAAAAAAAAAABAAID/9oADAMBAAIQAxAAAAGHXfXnTNo3QLMMn//EABwQAAEEAwEAAAAAAAAAAAAAAAEAAgMREiEyQf/aAAgBAQABBQIglYyNPSb1Qo7VYxeuFO//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/AR//xAAVEQEBAAAAAAAAAAAAAAAAAAAQAf/aAAgBAgEBPwEh/8QAGxABAQEAAgMAAAAAAAAAAAAAAQARAhAhMVH/2gAIAQEABj8CwtUtzvzPI9wfWS//xAAcEAEAAwEAAwEAAAAAAAAAAAABABEhQTFRYbH/2gAIAQEAAT8hoNVicxvJa1G17Di3z2NlFyJdjfmR9uj9lXxaQzFxn//aAAwDAQACAAMAAAAQ7wiC/8QAFxEBAAMAAAAAAAAAAAAAAAAAEAFBUf/aAAgBAwEBPxCNKP/EABgRAQEBAQEAAAAAAAAAAAAAAAEAIREx/9oACAECAQE/EDibeQMl2//EAB4QAQACAgIDAQAAAAAAAAAAAAEAESExQWFRcYHR/9oACAEBAAE/EFi6wXR963LFqBXk8X1ojc5F25uWkjlh6wXDD7Ws8jfjUuOGF6HuAiRF1kXEPqKKepWCUcfk/9k=",width:50,height:50,src:"/everydayblog/static/272e8ca81ab2a8cd0c319392a23038bc/9b664/profile-pic.jpg",srcSet:"/everydayblog/static/272e8ca81ab2a8cd0c319392a23038bc/9b664/profile-pic.jpg 1x,\n/everydayblog/static/272e8ca81ab2a8cd0c319392a23038bc/06a10/profile-pic.jpg 1.5x,\n/everydayblog/static/272e8ca81ab2a8cd0c319392a23038bc/f1b5a/profile-pic.jpg 2x"}}},site:{siteMetadata:{author:"chao",social:{twitter:"chaosrc"}}}}}},179:function(e,t,a){"use strict";var r=a(10);t.__esModule=!0,t.default=void 0;var i,n=r(a(8)),o=r(a(42)),s=r(a(96)),l=r(a(97)),d=r(a(0)),c=r(a(5)),u=function(e){var t=(0,l.default)({},e),a=t.resolutions,r=t.sizes,i=t.critical;return a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),i&&(t.loading="eager"),t},A=Object.create({}),f=function(e){var t=u(e),a=t.fluid?t.fluid.src:t.fixed.src;return A[a]||!1},p="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,g="undefined"!=typeof window,h=g&&window.IntersectionObserver,m=new WeakMap;var b=function(e,t){var a=(void 0===i&&"undefined"!=typeof window&&window.IntersectionObserver&&(i=new window.IntersectionObserver(function(e){e.forEach(function(e){if(m.has(e.target)){var t=m.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(i.unobserve(e.target),m.delete(e.target),t())}})},{rootMargin:"200px"})),i);return a&&(a.observe(e),m.set(e,t)),function(){a.unobserve(e),m.delete(e)}},y=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",r=e.srcSetWebp?"<source type='image/webp' srcset=\""+e.srcSetWebp+'" '+a+"/>":"",i=e.srcSet?'srcset="'+e.srcSet+'" ':"",n=e.title?'title="'+e.title+'" ':"",o=e.alt?'alt="'+e.alt+'" ':'alt="" ',s=e.width?'width="'+e.width+'" ':"",l=e.height?'height="'+e.height+'" ':"",d=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"";return"<picture>"+r+"<img "+(e.loading?'loading="'+e.loading+'" ':"")+s+l+a+i+t+o+n+d+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},E=d.default.forwardRef(function(e,t){var a=e.sizes,r=e.srcSet,i=e.src,n=e.style,o=e.onLoad,c=e.onError,u=e.loading,A=(0,s.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading"]);return d.default.createElement("img",(0,l.default)({sizes:a,srcSet:r,src:i},A,{onLoad:o,onError:c,ref:t,loading:u,style:(0,l.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},n)}))});E.propTypes={style:c.default.object,onError:c.default.func,onLoad:c.default.func};var v=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=g&&f(t),a.addNoScript=!(t.critical&&!t.fadeIn),a.useIOSupport=!p&&h&&!t.critical&&!a.seenBefore;var r=t.critical||g&&(p||!a.useIOSupport);return a.state={isVisible:r,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn},a.imageRef=d.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,o.default)((0,o.default)(a))),a.handleRef=a.handleRef.bind((0,o.default)((0,o.default)(a))),a}(0,n.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:f(this.props)}),this.props.critical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=b(e,function(){var e=f(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},function(){return t.setState({imgLoaded:e,imgCached:!!t.imageRef.current.currentSrc})})}))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=u(e),a=t.fluid?t.fluid.src:t.fixed.src,A[a]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=u(this.props),t=e.title,a=e.alt,r=e.className,i=e.style,n=void 0===i?{}:i,o=e.imgStyle,s=void 0===o?{}:o,c=e.placeholderStyle,A=void 0===c?{}:c,f=e.placeholderClassName,p=e.fluid,g=e.fixed,h=e.backgroundColor,m=e.durationFadeIn,b=e.Tag,v=e.itemProp,w=e.loading,S=!1===this.state.fadeIn||this.state.imgLoaded,j=!0===this.state.fadeIn&&!this.state.imgCached,R=(0,l.default)({opacity:S?1:0,transition:j?"opacity "+m+"ms":"none"},s),x="boolean"==typeof h?"lightgray":h,Q={transitionDelay:m+"ms"},B=(0,l.default)({opacity:this.state.imgLoaded?0:1},j&&Q,s,A),L={title:t,alt:this.state.isVisible?"":a,style:B,className:f};if(p){var I=p;return d.default.createElement(b,{className:(r||"")+" gatsby-image-wrapper",style:(0,l.default)({position:"relative",overflow:"hidden"},n),ref:this.handleRef,key:"fluid-"+JSON.stringify(I.srcSet)},d.default.createElement(b,{style:{width:"100%",paddingBottom:100/I.aspectRatio+"%"}}),x&&d.default.createElement(b,{title:t,style:(0,l.default)({backgroundColor:x,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},j&&Q)}),I.base64&&d.default.createElement(E,(0,l.default)({src:I.base64},L)),I.tracedSVG&&d.default.createElement(E,(0,l.default)({src:I.tracedSVG},L)),this.state.isVisible&&d.default.createElement("picture",null,I.srcSetWebp&&d.default.createElement("source",{type:"image/webp",srcSet:I.srcSetWebp,sizes:I.sizes}),d.default.createElement(E,{alt:a,title:t,sizes:I.sizes,src:I.src,crossOrigin:this.props.crossOrigin,srcSet:I.srcSet,style:R,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:v,loading:w})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:y((0,l.default)({alt:a,title:t,loading:w},I))}}))}if(g){var O=g,C=(0,l.default)({position:"relative",overflow:"hidden",display:"inline-block",width:O.width,height:O.height},n);return"inherit"===n.display&&delete C.display,d.default.createElement(b,{className:(r||"")+" gatsby-image-wrapper",style:C,ref:this.handleRef,key:"fixed-"+JSON.stringify(O.srcSet)},x&&d.default.createElement(b,{title:t,style:(0,l.default)({backgroundColor:x,width:O.width,opacity:this.state.imgLoaded?0:1,height:O.height},j&&Q)}),O.base64&&d.default.createElement(E,(0,l.default)({src:O.base64},L)),O.tracedSVG&&d.default.createElement(E,(0,l.default)({src:O.tracedSVG},L)),this.state.isVisible&&d.default.createElement("picture",null,O.srcSetWebp&&d.default.createElement("source",{type:"image/webp",srcSet:O.srcSetWebp,sizes:O.sizes}),d.default.createElement(E,{alt:a,title:t,width:O.width,height:O.height,sizes:O.sizes,src:O.src,crossOrigin:this.props.crossOrigin,srcSet:O.srcSet,style:R,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:v,loading:w})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:y((0,l.default)({alt:a,title:t,loading:w},O))}}))}return null},t}(d.default.Component);v.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var w=c.default.shape({width:c.default.number.isRequired,height:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string}),S=c.default.shape({aspectRatio:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,sizes:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string});v.propTypes={resolutions:w,sizes:S,fixed:w,fluid:S,fadeIn:c.default.bool,durationFadeIn:c.default.number,title:c.default.string,alt:c.default.string,className:c.default.oneOfType([c.default.string,c.default.object]),critical:c.default.bool,crossOrigin:c.default.oneOfType([c.default.string,c.default.bool]),style:c.default.object,imgStyle:c.default.object,placeholderStyle:c.default.object,placeholderClassName:c.default.string,backgroundColor:c.default.oneOfType([c.default.string,c.default.bool]),onLoad:c.default.func,onError:c.default.func,onStartLoad:c.default.func,Tag:c.default.string,itemProp:c.default.string,loading:c.default.oneOf(["auto","lazy","eager"])};var j=v;t.default=j}}]);
//# sourceMappingURL=component---src-pages-index-js-41c1210db087303bba04.js.map