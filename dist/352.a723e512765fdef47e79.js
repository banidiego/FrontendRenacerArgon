(self.webpackChunkargon_dashboard_pro_angular=self.webpackChunkargon_dashboard_pro_angular||[]).push([[352],{69352:function(e,t,n){"use strict";n.d(t,{tT:function(){return N},zk:function(){return M}});var i,o=n(72454),s=n(41998),r=n(31112),a=n(50483),c=n(20138),u=n(61116),d=n(69056),h=function(){var e=function(){function e(){(0,r.Z)(this,e),this._focusTrapStack=[]}return(0,s.Z)(e,[{key:"register",value:function(e){this._focusTrapStack=this._focusTrapStack.filter(function(t){return t!==e});var t=this._focusTrapStack;t.length&&t[t.length-1]._disable(),t.push(e),e._enable()}},{key:"deregister",value:function(e){e._disable();var t=this._focusTrapStack,n=t.indexOf(e);-1!==n&&(t.splice(n,1),t.length&&t[t.length-1]._enable())}}]),e}();return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e}();try{i="undefined"!=typeof Intl&&Intl.v8BreakIterator}catch(x){i=!1}var l=function(){var e=(0,s.Z)(function e(t){(0,r.Z)(this,e),this._platformId=t,this.isBrowser=this._platformId?(0,u.NF)(this._platformId):"object"==typeof document&&!!document,this.EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent),this.TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent),this.BLINK=this.isBrowser&&!(!window.chrome&&!i)&&"undefined"!=typeof CSS&&!this.EDGE&&!this.TRIDENT,this.WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT,this.IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window),this.FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent),this.ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT,this.SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT});return e.\u0275fac=function(t){return new(t||e)(a.LFG(a.Lbi))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e}(),f=function(){var e=function(){function e(t){(0,r.Z)(this,e),this._platform=t}return(0,s.Z)(e,[{key:"isDisabled",value:function(e){return e.hasAttribute("disabled")}},{key:"isVisible",value:function(e){return function(e){return!!(e.offsetWidth||e.offsetHeight||"function"==typeof e.getClientRects&&e.getClientRects().length)}(e)&&"visible"===getComputedStyle(e).visibility}},{key:"isTabbable",value:function(e){if(!this._platform.isBrowser)return!1;var t,n=function(e){try{return e.frameElement}catch(t){return null}}((t=e).ownerDocument&&t.ownerDocument.defaultView||window);if(n){if(-1===b(n))return!1;if(!this.isVisible(n))return!1}var i=e.nodeName.toLowerCase(),o=b(e);return e.hasAttribute("contenteditable")?-1!==o:"iframe"!==i&&"object"!==i&&!(this._platform.WEBKIT&&this._platform.IOS&&!function(e){var t=e.nodeName.toLowerCase(),n="input"===t&&e.type;return"text"===n||"password"===n||"select"===t||"textarea"===t}(e))&&("audio"===i?!!e.hasAttribute("controls")&&-1!==o:"video"===i?-1!==o&&(null!==o||this._platform.FIREFOX||e.hasAttribute("controls")):e.tabIndex>=0)}},{key:"isFocusable",value:function(e,t){return function(e){return!function(e){return function(e){return"input"==e.nodeName.toLowerCase()}(e)&&"hidden"==e.type}(e)&&(function(e){var t=e.nodeName.toLowerCase();return"input"===t||"select"===t||"button"===t||"textarea"===t}(e)||function(e){return function(e){return"a"==e.nodeName.toLowerCase()}(e)&&e.hasAttribute("href")}(e)||e.hasAttribute("contenteditable")||v(e))}(e)&&!this.isDisabled(e)&&((null==t?void 0:t.ignoreVisibility)||this.isVisible(e))}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.LFG(l))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e}();function v(e){if(!e.hasAttribute("tabindex")||void 0===e.tabIndex)return!1;var t=e.getAttribute("tabindex");return"-32768"!=t&&!(!t||isNaN(parseInt(t,10)))}function b(e){if(!v(e))return null;var t=parseInt(e.getAttribute("tabindex")||"",10);return isNaN(t)?-1:t}function m(e){return null!=e&&"false"!=="".concat(e)}var p=function(){function e(t,n,i,o){var s=this,a=arguments.length>4&&void 0!==arguments[4]&&arguments[4];(0,r.Z)(this,e),this._element=t,this._checker=n,this._ngZone=i,this._document=o,this._hasAttached=!1,this.startAnchorListener=function(){return s.focusLastTabbableElement()},this.endAnchorListener=function(){return s.focusFirstTabbableElement()},this._enabled=!0,a||this.attachAnchors()}return(0,s.Z)(e,[{key:"enabled",get:function(){return this._enabled},set:function(e){this._enabled=e,this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}},{key:"destroy",value:function(){var e=this._startAnchor,t=this._endAnchor;e&&(e.removeEventListener("focus",this.startAnchorListener),e.parentNode&&e.parentNode.removeChild(e)),t&&(t.removeEventListener("focus",this.endAnchorListener),t.parentNode&&t.parentNode.removeChild(t)),this._startAnchor=this._endAnchor=null,this._hasAttached=!1}},{key:"attachAnchors",value:function(){var e=this;return!!this._hasAttached||(this._ngZone.runOutsideAngular(function(){e._startAnchor||(e._startAnchor=e._createAnchor(),e._startAnchor.addEventListener("focus",e.startAnchorListener)),e._endAnchor||(e._endAnchor=e._createAnchor(),e._endAnchor.addEventListener("focus",e.endAnchorListener))}),this._element.parentNode&&(this._element.parentNode.insertBefore(this._startAnchor,this._element),this._element.parentNode.insertBefore(this._endAnchor,this._element.nextSibling),this._hasAttached=!0),this._hasAttached)}},{key:"focusInitialElementWhenReady",value:function(){var e=this;return new Promise(function(t){e._executeOnStable(function(){return t(e.focusInitialElement())})})}},{key:"focusFirstTabbableElementWhenReady",value:function(){var e=this;return new Promise(function(t){e._executeOnStable(function(){return t(e.focusFirstTabbableElement())})})}},{key:"focusLastTabbableElementWhenReady",value:function(){var e=this;return new Promise(function(t){e._executeOnStable(function(){return t(e.focusLastTabbableElement())})})}},{key:"_getRegionBoundary",value:function(e){for(var t=this._element.querySelectorAll("[cdk-focus-region-".concat(e,"], ")+"[cdkFocusRegion".concat(e,"], ")+"[cdk-focus-".concat(e,"]")),n=0;n<t.length;n++)t[n].hasAttribute("cdk-focus-".concat(e))?console.warn("Found use of deprecated attribute 'cdk-focus-".concat(e,"', ")+"use 'cdkFocusRegion".concat(e,"' instead. The deprecated ")+"attribute will be removed in 8.0.0.",t[n]):t[n].hasAttribute("cdk-focus-region-".concat(e))&&console.warn("Found use of deprecated attribute 'cdk-focus-region-".concat(e,"', ")+"use 'cdkFocusRegion".concat(e,"' instead. The deprecated attribute ")+"will be removed in 8.0.0.",t[n]);return"start"==e?t.length?t[0]:this._getFirstTabbableElement(this._element):t.length?t[t.length-1]:this._getLastTabbableElement(this._element)}},{key:"focusInitialElement",value:function(){var e=this._element.querySelector("[cdk-focus-initial], [cdkFocusInitial]");if(e){if(e.hasAttribute("cdk-focus-initial")&&console.warn("Found use of deprecated attribute 'cdk-focus-initial', use 'cdkFocusInitial' instead. The deprecated attribute will be removed in 8.0.0",e),!this._checker.isFocusable(e)){var t=this._getFirstTabbableElement(e);return null==t||t.focus(),!!t}return e.focus(),!0}return this.focusFirstTabbableElement()}},{key:"focusFirstTabbableElement",value:function(){var e=this._getRegionBoundary("start");return e&&e.focus(),!!e}},{key:"focusLastTabbableElement",value:function(){var e=this._getRegionBoundary("end");return e&&e.focus(),!!e}},{key:"hasAttached",value:function(){return this._hasAttached}},{key:"_getFirstTabbableElement",value:function(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;for(var t=e.children||e.childNodes,n=0;n<t.length;n++){var i=t[n].nodeType===this._document.ELEMENT_NODE?this._getFirstTabbableElement(t[n]):null;if(i)return i}return null}},{key:"_getLastTabbableElement",value:function(e){if(this._checker.isFocusable(e)&&this._checker.isTabbable(e))return e;for(var t=e.children||e.childNodes,n=t.length-1;n>=0;n--){var i=t[n].nodeType===this._document.ELEMENT_NODE?this._getLastTabbableElement(t[n]):null;if(i)return i}return null}},{key:"_createAnchor",value:function(){var e=this._document.createElement("div");return this._toggleAnchorTabIndex(this._enabled,e),e.classList.add("cdk-visually-hidden"),e.classList.add("cdk-focus-trap-anchor"),e.setAttribute("aria-hidden","true"),e}},{key:"_toggleAnchorTabIndex",value:function(e,t){e?t.setAttribute("tabindex","0"):t.removeAttribute("tabindex")}},{key:"toggleAnchors",value:function(e){this._startAnchor&&this._endAnchor&&(this._toggleAnchorTabIndex(e,this._startAnchor),this._toggleAnchorTabIndex(e,this._endAnchor))}},{key:"_executeOnStable",value:function(e){this._ngZone.isStable?e():this._ngZone.onStable.pipe((0,d.q)(1)).subscribe(e)}}]),e}(),g=function(){var e=function(){function e(t,n,i){(0,r.Z)(this,e),this._checker=t,this._ngZone=n,this._document=i}return(0,s.Z)(e,[{key:"create",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return new p(e,this._checker,this._ngZone,this._document,t)}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.LFG(f),a.LFG(a.R0b),a.LFG(u.K0))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e}(),_=function(){var e=function(){function e(t,n,i){(0,r.Z)(this,e),this._elementRef=t,this._focusTrapFactory=n,this._previouslyFocusedElement=null,this._autoCapture=!1,this._document=i,this.focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement,!0)}return(0,s.Z)(e,[{key:"enabled",get:function(){return this.focusTrap.enabled},set:function(e){this.focusTrap.enabled=m(e)}},{key:"autoCapture",get:function(){return this._autoCapture},set:function(e){this._autoCapture=m(e)}},{key:"ngOnDestroy",value:function(){this.focusTrap.destroy(),this._previouslyFocusedElement&&(this._previouslyFocusedElement.focus(),this._previouslyFocusedElement=null)}},{key:"ngAfterContentInit",value:function(){this.focusTrap.attachAnchors(),this.autoCapture&&this._captureFocus()}},{key:"ngDoCheck",value:function(){this.focusTrap.hasAttached()||this.focusTrap.attachAnchors()}},{key:"ngOnChanges",value:function(e){var t=e.autoCapture;t&&!t.firstChange&&this.autoCapture&&this.focusTrap.hasAttached()&&this._captureFocus()}},{key:"_captureFocus",value:function(){this._previouslyFocusedElement=this._document.activeElement,this.focusTrap.focusInitialElementWhenReady()}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.Y36(a.SBq),a.Y36(g),a.Y36(u.K0))},e.\u0275dir=a.lG2({type:e,selectors:[["","focusTrap",""]],inputs:{enabled:["cdkTrapFocus","enabled"],autoCapture:["cdkTrapFocusAutoCapture","autoCapture"]},exportAs:["focusTrap"],features:[a.TTD]}),e}(),y=function(){var e=function(){function e(){(0,r.Z)(this,e)}return(0,s.Z)(e,null,[{key:"forRoot",value:function(){return{ngModule:e,providers:[h,l,f]}}}]),e}();return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[u.ez]]}),e}(),k=n(95258),A=n(62952),w=["*"],S=function(){var e=(0,s.Z)(function e(){(0,r.Z)(this,e),this.hide=function(){},this.setClass=function(){}});return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"platform"}),e}(),E=function(){var e=(0,s.Z)(function e(){(0,r.Z)(this,e)});return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"platform"}),e}(),T={backdrop:!0,keyboard:!0,focus:!0,show:!1,ignoreBackdropClick:!1,class:"",animated:!0,initialState:{},closeInterceptor:void 0},C=new a.OlP("override-default-config"),I="modal-open",F="fade",L="in",B="show",R=function(){var e=function(){function e(t,n,i){(0,r.Z)(this,e),this._element=n,this._renderer=i,this.isShown=!1,this.isAnimated=!1,this.isModalHiding=!1,this.clickStartedInContent=!1,this.config=Object.assign({},t)}return(0,s.Z)(e,[{key:"ngOnInit",value:function(){var e=this;this.isAnimated&&this._renderer.addClass(this._element.nativeElement,F),this._renderer.setStyle(this._element.nativeElement,"display","block"),setTimeout(function(){e.isShown=!0,e._renderer.addClass(e._element.nativeElement,(0,c.XA)()?L:B)},this.isAnimated?150:0),document&&document.body&&(this.bsModalService&&1===this.bsModalService.getModalsCount()&&(this.bsModalService.checkScrollbar(),this.bsModalService.setScrollbar()),this._renderer.addClass(document.body,I),this._renderer.setStyle(document.body,"overflow-y","hidden")),this._element.nativeElement&&this._element.nativeElement.focus()}},{key:"onClickStarted",value:function(e){this.clickStartedInContent=e.target!==this._element.nativeElement}},{key:"onClickStop",value:function(e){var t;this.config.ignoreBackdropClick||"static"===this.config.backdrop||e.target!==this._element.nativeElement||this.clickStartedInContent?this.clickStartedInContent=!1:(null===(t=this.bsModalService)||void 0===t||t.setDismissReason("backdrop-click"),this.hide())}},{key:"onPopState",value:function(){var e;null===(e=this.bsModalService)||void 0===e||e.setDismissReason("browser-back-navigation-clicked"),this.hide()}},{key:"onEsc",value:function(e){var t,n;this.isShown&&(27!==e.keyCode&&"Escape"!==e.key||e.preventDefault(),this.config.keyboard&&this.level===(null===(t=this.bsModalService)||void 0===t?void 0:t.getModalsCount())&&(null===(n=this.bsModalService)||void 0===n||n.setDismissReason("esc"),this.hide()))}},{key:"ngOnDestroy",value:function(){this.isShown&&this._hide()}},{key:"hide",value:function(){var e=this;!this.isModalHiding&&this.isShown&&(this.config.closeInterceptor?this.config.closeInterceptor().then(function(){return e._hide()},function(){}):this._hide())}},{key:"_hide",value:function(){var e=this;this.isModalHiding=!0,this._renderer.removeClass(this._element.nativeElement,(0,c.XA)()?L:B),setTimeout(function(){var t,n;e.isShown=!1,document&&document.body&&1===(null===(t=e.bsModalService)||void 0===t?void 0:t.getModalsCount())&&(e._renderer.removeClass(document.body,I),e._renderer.setStyle(document.body,"overflow-y","")),null===(n=e.bsModalService)||void 0===n||n.hide(e.config.id),e.isModalHiding=!1},this.isAnimated?300:0)}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.Y36(E),a.Y36(a.SBq),a.Y36(a.Qsj))},e.\u0275cmp=a.Xpm({type:e,selectors:[["modal-container"]],hostAttrs:["role","dialog","tabindex","-1",1,"modal"],hostVars:3,hostBindings:function(e,t){1&e&&a.NdJ("mousedown",function(e){return t.onClickStarted(e)})("click",function(e){return t.onClickStop(e)})("popstate",function(){return t.onPopState()},!1,a.Jf7)("keydown.esc",function(e){return t.onEsc(e)},!1,a.Jf7),2&e&&a.uIk("aria-modal",!0)("aria-labelledby",t.config.ariaLabelledBy)("aria-describedby",t.config.ariaDescribedby)},ngContentSelectors:w,decls:3,vars:2,consts:[["role","document","focusTrap",""],[1,"modal-content"]],template:function(e,t){1&e&&(a.F$t(),a.TgZ(0,"div",0),a.TgZ(1,"div",1),a.Hsn(2),a.qZA(),a.qZA()),2&e&&a.Tol("modal-dialog"+(t.config.class?" "+t.config.class:""))},directives:[_],encapsulation:2}),e}(),Z=function(){var e=function(){function e(t,n){(0,r.Z)(this,e),this._isAnimated=!1,this._isShown=!1,this.element=t,this.renderer=n}return(0,s.Z)(e,[{key:"isAnimated",get:function(){return this._isAnimated},set:function(e){this._isAnimated=e}},{key:"isShown",get:function(){return this._isShown},set:function(e){this._isShown=e,e?this.renderer.addClass(this.element.nativeElement,"".concat(L)):this.renderer.removeClass(this.element.nativeElement,"".concat(L)),(0,c.XA)()||(e?this.renderer.addClass(this.element.nativeElement,"".concat(B)):this.renderer.removeClass(this.element.nativeElement,"".concat(B)))}},{key:"ngOnInit",value:function(){this.isAnimated&&(this.renderer.addClass(this.element.nativeElement,"".concat(F)),c.cQ.reflow(this.element.nativeElement)),this.isShown=!0}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.Y36(a.SBq),a.Y36(a.Qsj))},e.\u0275cmp=a.Xpm({type:e,selectors:[["bs-modal-backdrop"]],hostAttrs:[1,"modal-backdrop"],decls:0,vars:0,template:function(e,t){},encapsulation:2}),e}(),D=1,N=function(){var e=function(){function e(t,n,i){(0,r.Z)(this,e),this.clf=n,this.modalDefaultOption=i,this.onShow=new a.vpe,this.onShown=new a.vpe,this.onHide=new a.vpe,this.onHidden=new a.vpe,this.isBodyOverflowing=!1,this.originalBodyPadding=0,this.scrollbarWidth=0,this.modalsCount=0,this.loaders=[],this._backdropLoader=this.clf.createLoader(),this._renderer=t.createRenderer(null,null),this.config=i?Object.assign({},T,i):T}return(0,s.Z)(e,[{key:"show",value:function(e,t){this.modalsCount++,this._createLoaders();var n=(null==t?void 0:t.id)||D++;return this.config=this.modalDefaultOption?Object.assign({},T,this.modalDefaultOption,t):Object.assign({},T,t),this.config.id=n,this._showBackdrop(),this.lastDismissReason=void 0,this._showModal(e)}},{key:"hide",value:function(e){var t=this;1!==this.modalsCount&&null!=e||(this._hideBackdrop(),this.resetScrollbar()),this.modalsCount=this.modalsCount>=1&&null!=e?this.modalsCount-1:0,setTimeout(function(){t._hideModal(e),t.removeLoaders(e)},this.config.animated?150:0)}},{key:"_showBackdrop",value:function(){var e=!0===this.config.backdrop||"static"===this.config.backdrop,t=!this.backdropRef||!this.backdropRef.instance.isShown;1===this.modalsCount&&(this.removeBackdrop(),e&&t&&(this._backdropLoader.attach(Z).to("body").show({isAnimated:this.config.animated}),this.backdropRef=this._backdropLoader._componentRef))}},{key:"_hideBackdrop",value:function(){var e=this;this.backdropRef&&(this.backdropRef.instance.isShown=!1,setTimeout(function(){return e.removeBackdrop()},this.config.animated?150:0))}},{key:"_showModal",value:function(e){var t=this.loaders[this.loaders.length-1];if(this.config&&this.config.providers){var n,i=(0,o.Z)(this.config.providers);try{for(i.s();!(n=i.n()).done;)t.provide(n.value)}catch(u){i.e(u)}finally{i.f()}}var s,r=new S,c=t.provide({provide:E,useValue:this.config}).provide({provide:S,useValue:r}).attach(R).to("body");return r.hide=function(){var e;return null===(e=c.instance)||void 0===e?void 0:e.hide()},r.setClass=function(e){c.instance&&(c.instance.config.class=e)},r.onHidden=new a.vpe,r.onHide=new a.vpe,this.copyEvent(t.onBeforeHide,r.onHide),this.copyEvent(t.onHidden,r.onHidden),c.show({content:e,isAnimated:this.config.animated,initialState:this.config.initialState,bsModalService:this,id:this.config.id}),c.instance&&(c.instance.level=this.getModalsCount(),r.content=t.getInnerComponent(),r.id=null===(s=c.instance.config)||void 0===s?void 0:s.id),r}},{key:"_hideModal",value:function(e){if(null!=e){var t=this.loaders.findIndex(function(t){var n;return(null===(n=t.instance)||void 0===n?void 0:n.config.id)===e}),n=this.loaders[t];n&&n.hide(e)}else this.loaders.forEach(function(e){e.instance&&e.hide(e.instance.config.id)})}},{key:"getModalsCount",value:function(){return this.modalsCount}},{key:"setDismissReason",value:function(e){this.lastDismissReason=e}},{key:"removeBackdrop",value:function(){this._renderer.removeClass(document.body,I),this._renderer.setStyle(document.body,"overflow-y",""),this._backdropLoader.hide(),this.backdropRef=void 0}},{key:"checkScrollbar",value:function(){this.isBodyOverflowing=document.body.clientWidth<window.innerWidth,this.scrollbarWidth=this.getScrollbarWidth()}},{key:"setScrollbar",value:function(){document&&(this.originalBodyPadding=parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")||"0",10),this.isBodyOverflowing&&(document.body.style.paddingRight="".concat(this.originalBodyPadding+this.scrollbarWidth,"px")))}},{key:"resetScrollbar",value:function(){document.body.style.paddingRight="".concat(this.originalBodyPadding,"px")}},{key:"getScrollbarWidth",value:function(){var e=this._renderer.createElement("div");this._renderer.addClass(e,"modal-scrollbar-measure"),this._renderer.appendChild(document.body,e);var t=e.offsetWidth-e.clientWidth;return this._renderer.removeChild(document.body,e),t}},{key:"_createLoaders",value:function(){var e=this.clf.createLoader();this.copyEvent(e.onBeforeShow,this.onShow),this.copyEvent(e.onShown,this.onShown),this.copyEvent(e.onBeforeHide,this.onHide),this.copyEvent(e.onHidden,this.onHidden),this.loaders.push(e)}},{key:"removeLoaders",value:function(e){if(null!=e){var t=this.loaders.findIndex(function(t){var n;return(null===(n=t.instance)||void 0===n?void 0:n.config.id)===e});t>=0&&(this.loaders.splice(t,1),this.loaders.forEach(function(e,t){e.instance&&(e.instance.level=t+1)}))}else this.loaders.splice(0,this.loaders.length)}},{key:"copyEvent",value:function(e,t){var n=this;e.subscribe(function(e){t.emit(n.lastDismissReason||e)})}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.LFG(a.FYo),a.LFG(k.oj),a.LFG(C,8))},e.\u0275prov=a.Yz7({token:e,factory:e.\u0275fac,providedIn:"platform"}),e}(),M=(y.forRoot(),function(){var e=function(){function e(){(0,r.Z)(this,e)}return(0,s.Z)(e,null,[{key:"forRoot",value:function(){return{ngModule:e,providers:[N,k.oj,A.sA]}}},{key:"forChild",value:function(){return{ngModule:e,providers:[N,k.oj,A.sA]}}}]),e}();return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=a.oAB({type:e}),e.\u0275inj=a.cJS({imports:[[y]]}),e}())}}]);