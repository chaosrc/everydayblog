(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{166:function(t,e,n){"use strict";n.r(e),n.d(e,"pageQuery",function(){return l});var a=n(8),r=n.n(a),i=n(0),o=n.n(i),c=n(172),s=n(173),u=function(t){function e(){return t.apply(this,arguments)||this}return r()(e,t),e.prototype.render=function(){var t=this.props.data.site.siteMetadata.title;return o.a.createElement(c.a,{location:this.props.location,title:t},o.a.createElement(s.a,{title:"404: Not Found"}),o.a.createElement("h1",null,"Not Found"),o.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))},e}(o.a.Component);e.default=u;var l="1097489062"},168:function(t,e,n){"use strict";n.d(e,"b",function(){return d});var a=n(0),r=n.n(a),i=n(5),o=n.n(i),c=n(40),s=n.n(c);n.d(e,"a",function(){return s.a});n(170);var u=r.a.createContext({});function l(t){var e=t.staticQueryData,n=t.data,a=t.query,i=t.render,o=n?n.data:e[a]&&e[a].data;return r.a.createElement(r.a.Fragment,null,o&&i(o),!o&&r.a.createElement("div",null,"Loading (StaticQuery)"))}var d=function(t){var e=t.data,n=t.query,a=t.render,i=t.children;return r.a.createElement(u.Consumer,null,function(t){return r.a.createElement(l,{data:e,query:n,render:a||i,staticQueryData:t})})};d.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},169:function(t,e,n){"use strict";n.d(e,"a",function(){return s}),n.d(e,"b",function(){return u});var a=n(180),r=n.n(a),i=n(181),o=n.n(i);o.a.overrideThemeStyles=function(){return{"a.gatsby-resp-image-link":{boxShadow:"none"}}},delete o.a.googleFonts;var c=new r.a(o.a);var s=c.rhythm,u=c.scale},170:function(t,e,n){var a;t.exports=(a=n(171))&&a.default||a},171:function(t,e,n){"use strict";n.r(e);n(41);var a=n(0),r=n.n(a),i=n(5),o=n.n(i),c=n(64),s=function(t){var e=t.location,n=t.pageResources;return n?r.a.createElement(c.a,Object.assign({location:e,pageResources:n},n.json)):null};s.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},e.default=s},172:function(t,e,n){"use strict";n(41);var a=n(8),r=n.n(a),i=n(0),o=n.n(i),c=n(168),s=n(169),u=function(t){function e(){return t.apply(this,arguments)||this}return r()(e,t),e.prototype.render=function(){var t,e=this.props,n=e.location,a=e.title,r=e.children;return t="/./"===n.pathname?o.a.createElement("h1",{style:Object.assign({},Object(s.b)(1.5),{marginBottom:Object(s.a)(1.5),marginTop:0})},o.a.createElement(c.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},a)):o.a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0}},o.a.createElement(c.a,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},a)),o.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(s.a)(24),padding:Object(s.a)(1.5)+" "+Object(s.a)(.75)}},o.a.createElement("header",null,t),o.a.createElement("main",null,r),o.a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",o.a.createElement("a",{href:"https://www.gatsbyjs.org"},"Gatsby")))},e}(o.a.Component);e.a=u},173:function(t,e,n){"use strict";var a=n(174),r=n(0),i=n.n(r),o=n(5),c=n.n(o),s=n(182),u=n.n(s);function l(t){var e=t.description,n=t.lang,r=t.meta,o=t.title,c=a.data.site,s=e||c.siteMetadata.description;return i.a.createElement(u.a,{htmlAttributes:{lang:n},title:o,titleTemplate:"%s | "+c.siteMetadata.title,meta:[{name:"description",content:s},{property:"og:title",content:o},{property:"og:description",content:s},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:o},{name:"twitter:description",content:s}].concat(r)})}l.defaultProps={lang:"en",meta:[],description:""},l.propTypes={description:c.a.string,lang:c.a.string,meta:c.a.arrayOf(c.a.object),title:c.a.string.isRequired},e.a=l},174:function(t){t.exports={data:{site:{siteMetadata:{title:"温故而知新",description:"个人博客, 坚持每天一篇！",author:"chao"}}}}}}]);
//# sourceMappingURL=component---src-pages-404-js-7dbca650e540e0572627.js.map