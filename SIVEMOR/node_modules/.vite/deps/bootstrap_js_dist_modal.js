import { t as __commonJSMin } from "./chunk-BVTlhY3a.js";
//#region node_modules/bootstrap/js/dist/dom/data.js
var require_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap data.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Data = factory());
	})(exports, (function() {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/data.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const elementMap = /* @__PURE__ */ new Map();
		return {
			set(element, key, instance) {
				if (!elementMap.has(element)) elementMap.set(element, /* @__PURE__ */ new Map());
				const instanceMap = elementMap.get(element);
				if (!instanceMap.has(key) && instanceMap.size !== 0) {
					console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
					return;
				}
				instanceMap.set(key, instance);
			},
			get(element, key) {
				if (elementMap.has(element)) return elementMap.get(element).get(key) || null;
				return null;
			},
			remove(element, key) {
				if (!elementMap.has(element)) return;
				const instanceMap = elementMap.get(element);
				instanceMap.delete(key);
				if (instanceMap.size === 0) elementMap.delete(element);
			}
		};
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap index.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.Index = {}));
	})(exports, (function(exports$2) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/index.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const MAX_UID = 1e6;
		const MILLISECONDS_MULTIPLIER = 1e3;
		const TRANSITION_END = "transitionend";
		/**
		* Properly escape IDs selectors to handle weird IDs
		* @param {string} selector
		* @returns {string}
		*/
		const parseSelector = (selector) => {
			if (selector && window.CSS && window.CSS.escape) selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
			return selector;
		};
		const toType = (object) => {
			if (object === null || object === void 0) return `${object}`;
			return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
		};
		/**
		* Public Util API
		*/
		const getUID = (prefix) => {
			do
				prefix += Math.floor(Math.random() * MAX_UID);
			while (document.getElementById(prefix));
			return prefix;
		};
		const getTransitionDurationFromElement = (element) => {
			if (!element) return 0;
			let { transitionDuration, transitionDelay } = window.getComputedStyle(element);
			if (!Number.parseFloat(transitionDuration) && !Number.parseFloat(transitionDelay)) return 0;
			transitionDuration = transitionDuration.split(",")[0];
			transitionDelay = transitionDelay.split(",")[0];
			return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
		};
		const triggerTransitionEnd = (element) => {
			element.dispatchEvent(new Event(TRANSITION_END));
		};
		const isElement = (object) => {
			if (!object || typeof object !== "object") return false;
			if (typeof object.jquery !== "undefined") object = object[0];
			return typeof object.nodeType !== "undefined";
		};
		const getElement = (object) => {
			if (isElement(object)) return object.jquery ? object[0] : object;
			if (typeof object === "string" && object.length > 0) return document.querySelector(parseSelector(object));
			return null;
		};
		const isVisible = (element) => {
			if (!isElement(element) || element.getClientRects().length === 0) return false;
			const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
			const closedDetails = element.closest("details:not([open])");
			if (!closedDetails) return elementIsVisible;
			if (closedDetails !== element) {
				const summary = element.closest("summary");
				if (summary && summary.parentNode !== closedDetails) return false;
				if (summary === null) return false;
			}
			return elementIsVisible;
		};
		const isDisabled = (element) => {
			if (!element || element.nodeType !== Node.ELEMENT_NODE) return true;
			if (element.classList.contains("disabled")) return true;
			if (typeof element.disabled !== "undefined") return element.disabled;
			return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
		};
		const findShadowRoot = (element) => {
			if (!document.documentElement.attachShadow) return null;
			if (typeof element.getRootNode === "function") {
				const root = element.getRootNode();
				return root instanceof ShadowRoot ? root : null;
			}
			if (element instanceof ShadowRoot) return element;
			if (!element.parentNode) return null;
			return findShadowRoot(element.parentNode);
		};
		const noop = () => {};
		/**
		* Trick to restart an element's animation
		*
		* @param {HTMLElement} element
		* @return void
		*
		* @see https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
		*/
		const reflow = (element) => {
			element.offsetHeight;
		};
		const getjQuery = () => {
			if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) return window.jQuery;
			return null;
		};
		const DOMContentLoadedCallbacks = [];
		const onDOMContentLoaded = (callback) => {
			if (document.readyState === "loading") {
				if (!DOMContentLoadedCallbacks.length) document.addEventListener("DOMContentLoaded", () => {
					for (const callback of DOMContentLoadedCallbacks) callback();
				});
				DOMContentLoadedCallbacks.push(callback);
			} else callback();
		};
		const isRTL = () => document.documentElement.dir === "rtl";
		const defineJQueryPlugin = (plugin) => {
			onDOMContentLoaded(() => {
				const $ = getjQuery();
				/* istanbul ignore if */
				if ($) {
					const name = plugin.NAME;
					const JQUERY_NO_CONFLICT = $.fn[name];
					$.fn[name] = plugin.jQueryInterface;
					$.fn[name].Constructor = plugin;
					$.fn[name].noConflict = () => {
						$.fn[name] = JQUERY_NO_CONFLICT;
						return plugin.jQueryInterface;
					};
				}
			});
		};
		const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
			return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
		};
		const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
			if (!waitForTransition) {
				execute(callback);
				return;
			}
			const emulatedDuration = getTransitionDurationFromElement(transitionElement) + 5;
			let called = false;
			const handler = ({ target }) => {
				if (target !== transitionElement) return;
				called = true;
				transitionElement.removeEventListener(TRANSITION_END, handler);
				execute(callback);
			};
			transitionElement.addEventListener(TRANSITION_END, handler);
			setTimeout(() => {
				if (!called) triggerTransitionEnd(transitionElement);
			}, emulatedDuration);
		};
		/**
		* Return the previous/next element of a list.
		*
		* @param {array} list    The list of elements
		* @param activeElement   The active element
		* @param shouldGetNext   Choose to get next or previous element
		* @param isCycleAllowed
		* @return {Element|elem} The proper element
		*/
		const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
			const listLength = list.length;
			let index = list.indexOf(activeElement);
			if (index === -1) return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
			index += shouldGetNext ? 1 : -1;
			if (isCycleAllowed) index = (index + listLength) % listLength;
			return list[Math.max(0, Math.min(index, listLength - 1))];
		};
		exports$2.defineJQueryPlugin = defineJQueryPlugin;
		exports$2.execute = execute;
		exports$2.executeAfterTransition = executeAfterTransition;
		exports$2.findShadowRoot = findShadowRoot;
		exports$2.getElement = getElement;
		exports$2.getNextActiveElement = getNextActiveElement;
		exports$2.getTransitionDurationFromElement = getTransitionDurationFromElement;
		exports$2.getUID = getUID;
		exports$2.getjQuery = getjQuery;
		exports$2.isDisabled = isDisabled;
		exports$2.isElement = isElement;
		exports$2.isRTL = isRTL;
		exports$2.isVisible = isVisible;
		exports$2.noop = noop;
		exports$2.onDOMContentLoaded = onDOMContentLoaded;
		exports$2.parseSelector = parseSelector;
		exports$2.reflow = reflow;
		exports$2.toType = toType;
		exports$2.triggerTransitionEnd = triggerTransitionEnd;
		Object.defineProperty(exports$2, Symbol.toStringTag, { value: "Module" });
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/event-handler.js
var require_event_handler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap event-handler.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.EventHandler = factory(global.Index));
	})(exports, (function(index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/event-handler.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
		const stripNameRegex = /\..*/;
		const stripUidRegex = /::\d+$/;
		const eventRegistry = {};
		let uidEvent = 1;
		const customEvents = {
			mouseenter: "mouseover",
			mouseleave: "mouseout"
		};
		const nativeEvents = new Set([
			"click",
			"dblclick",
			"mouseup",
			"mousedown",
			"contextmenu",
			"mousewheel",
			"DOMMouseScroll",
			"mouseover",
			"mouseout",
			"mousemove",
			"selectstart",
			"selectend",
			"keydown",
			"keypress",
			"keyup",
			"orientationchange",
			"touchstart",
			"touchmove",
			"touchend",
			"touchcancel",
			"pointerdown",
			"pointermove",
			"pointerup",
			"pointerleave",
			"pointercancel",
			"gesturestart",
			"gesturechange",
			"gestureend",
			"focus",
			"blur",
			"change",
			"reset",
			"select",
			"submit",
			"focusin",
			"focusout",
			"load",
			"unload",
			"beforeunload",
			"resize",
			"move",
			"DOMContentLoaded",
			"readystatechange",
			"error",
			"abort",
			"scroll"
		]);
		/**
		* Private methods
		*/
		function makeEventUid(element, uid) {
			return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
		}
		function getElementEvents(element) {
			const uid = makeEventUid(element);
			element.uidEvent = uid;
			eventRegistry[uid] = eventRegistry[uid] || {};
			return eventRegistry[uid];
		}
		function bootstrapHandler(element, fn) {
			return function handler(event) {
				hydrateObj(event, { delegateTarget: element });
				if (handler.oneOff) EventHandler.off(element, event.type, fn);
				return fn.apply(element, [event]);
			};
		}
		function bootstrapDelegationHandler(element, selector, fn) {
			return function handler(event) {
				const domElements = element.querySelectorAll(selector);
				for (let { target } = event; target && target !== this; target = target.parentNode) for (const domElement of domElements) {
					if (domElement !== target) continue;
					hydrateObj(event, { delegateTarget: target });
					if (handler.oneOff) EventHandler.off(element, event.type, selector, fn);
					return fn.apply(target, [event]);
				}
			};
		}
		function findHandler(events, callable, delegationSelector = null) {
			return Object.values(events).find((event) => event.callable === callable && event.delegationSelector === delegationSelector);
		}
		function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
			const isDelegated = typeof handler === "string";
			const callable = isDelegated ? delegationFunction : handler || delegationFunction;
			let typeEvent = getTypeEvent(originalTypeEvent);
			if (!nativeEvents.has(typeEvent)) typeEvent = originalTypeEvent;
			return [
				isDelegated,
				callable,
				typeEvent
			];
		}
		function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
			if (typeof originalTypeEvent !== "string" || !element) return;
			let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
			if (originalTypeEvent in customEvents) {
				const wrapFunction = (fn) => {
					return function(event) {
						if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) return fn.call(this, event);
					};
				};
				callable = wrapFunction(callable);
			}
			const events = getElementEvents(element);
			const handlers = events[typeEvent] || (events[typeEvent] = {});
			const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
			if (previousFunction) {
				previousFunction.oneOff = previousFunction.oneOff && oneOff;
				return;
			}
			const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
			const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
			fn.delegationSelector = isDelegated ? handler : null;
			fn.callable = callable;
			fn.oneOff = oneOff;
			fn.uidEvent = uid;
			handlers[uid] = fn;
			element.addEventListener(typeEvent, fn, isDelegated);
		}
		function removeHandler(element, events, typeEvent, handler, delegationSelector) {
			const fn = findHandler(events[typeEvent], handler, delegationSelector);
			if (!fn) return;
			element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
			delete events[typeEvent][fn.uidEvent];
		}
		function removeNamespacedHandlers(element, events, typeEvent, namespace) {
			const storeElementEvent = events[typeEvent] || {};
			for (const [handlerKey, event] of Object.entries(storeElementEvent)) if (handlerKey.includes(namespace)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
		}
		function getTypeEvent(event) {
			event = event.replace(stripNameRegex, "");
			return customEvents[event] || event;
		}
		const EventHandler = {
			on(element, event, handler, delegationFunction) {
				addHandler(element, event, handler, delegationFunction, false);
			},
			one(element, event, handler, delegationFunction) {
				addHandler(element, event, handler, delegationFunction, true);
			},
			off(element, originalTypeEvent, handler, delegationFunction) {
				if (typeof originalTypeEvent !== "string" || !element) return;
				const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
				const inNamespace = typeEvent !== originalTypeEvent;
				const events = getElementEvents(element);
				const storeElementEvent = events[typeEvent] || {};
				const isNamespace = originalTypeEvent.startsWith(".");
				if (typeof callable !== "undefined") {
					if (!Object.keys(storeElementEvent).length) return;
					removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
					return;
				}
				if (isNamespace) for (const elementEvent of Object.keys(events)) removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
				for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
					const handlerKey = keyHandlers.replace(stripUidRegex, "");
					if (!inNamespace || originalTypeEvent.includes(handlerKey)) removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
				}
			},
			trigger(element, event, args) {
				if (typeof event !== "string" || !element) return null;
				const $ = index_js.getjQuery();
				const inNamespace = event !== getTypeEvent(event);
				let jQueryEvent = null;
				let bubbles = true;
				let nativeDispatch = true;
				let defaultPrevented = false;
				if (inNamespace && $) {
					jQueryEvent = $.Event(event, args);
					$(element).trigger(jQueryEvent);
					bubbles = !jQueryEvent.isPropagationStopped();
					nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
					defaultPrevented = jQueryEvent.isDefaultPrevented();
				}
				const evt = hydrateObj(new Event(event, {
					bubbles,
					cancelable: true
				}), args);
				if (defaultPrevented) evt.preventDefault();
				if (nativeDispatch) element.dispatchEvent(evt);
				if (evt.defaultPrevented && jQueryEvent) jQueryEvent.preventDefault();
				return evt;
			}
		};
		function hydrateObj(obj, meta = {}) {
			for (const [key, value] of Object.entries(meta)) try {
				obj[key] = value;
			} catch (_unused) {
				Object.defineProperty(obj, key, {
					configurable: true,
					get() {
						return value;
					}
				});
			}
			return obj;
		}
		return EventHandler;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/manipulator.js
var require_manipulator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap manipulator.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Manipulator = factory());
	})(exports, (function() {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/manipulator.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		function normalizeData(value) {
			if (value === "true") return true;
			if (value === "false") return false;
			if (value === Number(value).toString()) return Number(value);
			if (value === "" || value === "null") return null;
			if (typeof value !== "string") return value;
			try {
				return JSON.parse(decodeURIComponent(value));
			} catch (_unused) {
				return value;
			}
		}
		function normalizeDataKey(key) {
			return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
		}
		return {
			setDataAttribute(element, key, value) {
				element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
			},
			removeDataAttribute(element, key) {
				element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
			},
			getDataAttributes(element) {
				if (!element) return {};
				const attributes = {};
				const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
				for (const key of bsKeys) {
					let pureKey = key.replace(/^bs/, "");
					pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
					attributes[pureKey] = normalizeData(element.dataset[key]);
				}
				return attributes;
			},
			getDataAttribute(element, key) {
				return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
			}
		};
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap config.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_util()) : typeof define === "function" && define.amd ? define(["../dom/manipulator", "./index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Config = factory(global.Manipulator, global.Index));
	})(exports, (function(Manipulator, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/config.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Class definition
		*/
		class Config {
			static get Default() {
				return {};
			}
			static get DefaultType() {
				return {};
			}
			static get NAME() {
				throw new Error("You have to implement the static method \"NAME\", for each component!");
			}
			_getConfig(config) {
				config = this._mergeConfigObj(config);
				config = this._configAfterMerge(config);
				this._typeCheckConfig(config);
				return config;
			}
			_configAfterMerge(config) {
				return config;
			}
			_mergeConfigObj(config, element) {
				const jsonConfig = index_js.isElement(element) ? Manipulator.getDataAttribute(element, "config") : {};
				return {
					...this.constructor.Default,
					...typeof jsonConfig === "object" ? jsonConfig : {},
					...index_js.isElement(element) ? Manipulator.getDataAttributes(element) : {},
					...typeof config === "object" ? config : {}
				};
			}
			_typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
				for (const [property, expectedTypes] of Object.entries(configTypes)) {
					const value = config[property];
					const valueType = index_js.isElement(value) ? "element" : index_js.toType(value);
					if (!new RegExp(expectedTypes).test(valueType)) throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
				}
			}
		}
		return Config;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/base-component.js
var require_base_component = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap base-component.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_data(), require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define([
			"./dom/data",
			"./dom/event-handler",
			"./util/config",
			"./util/index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.BaseComponent = factory(global.Data, global.EventHandler, global.Config, global.Index));
	})(exports, (function(Data, EventHandler, Config, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap base-component.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const VERSION = "5.3.8";
		/**
		* Class definition
		*/
		class BaseComponent extends Config {
			constructor(element, config) {
				super();
				element = index_js.getElement(element);
				if (!element) return;
				this._element = element;
				this._config = this._getConfig(config);
				Data.set(this._element, this.constructor.DATA_KEY, this);
			}
			dispose() {
				Data.remove(this._element, this.constructor.DATA_KEY);
				EventHandler.off(this._element, this.constructor.EVENT_KEY);
				for (const propertyName of Object.getOwnPropertyNames(this)) this[propertyName] = null;
			}
			_queueCallback(callback, element, isAnimated = true) {
				index_js.executeAfterTransition(callback, element, isAnimated);
			}
			_getConfig(config) {
				config = this._mergeConfigObj(config, this._element);
				config = this._configAfterMerge(config);
				this._typeCheckConfig(config);
				return config;
			}
			static getInstance(element) {
				return Data.get(index_js.getElement(element), this.DATA_KEY);
			}
			static getOrCreateInstance(element, config = {}) {
				return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
			}
			static get VERSION() {
				return VERSION;
			}
			static get DATA_KEY() {
				return `bs.${this.NAME}`;
			}
			static get EVENT_KEY() {
				return `.${this.DATA_KEY}`;
			}
			static eventName(name) {
				return `${name}${this.EVENT_KEY}`;
			}
		}
		return BaseComponent;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/dom/selector-engine.js
var require_selector_engine = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap selector-engine.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_util()) : typeof define === "function" && define.amd ? define(["../util/index"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SelectorEngine = factory(global.Index));
	})(exports, (function(index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap dom/selector-engine.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const getSelector = (element) => {
			let selector = element.getAttribute("data-bs-target");
			if (!selector || selector === "#") {
				let hrefAttribute = element.getAttribute("href");
				if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) return null;
				if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
				selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
			}
			return selector ? selector.split(",").map((sel) => index_js.parseSelector(sel)).join(",") : null;
		};
		const SelectorEngine = {
			find(selector, element = document.documentElement) {
				return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
			},
			findOne(selector, element = document.documentElement) {
				return Element.prototype.querySelector.call(element, selector);
			},
			children(element, selector) {
				return [].concat(...element.children).filter((child) => child.matches(selector));
			},
			parents(element, selector) {
				const parents = [];
				let ancestor = element.parentNode.closest(selector);
				while (ancestor) {
					parents.push(ancestor);
					ancestor = ancestor.parentNode.closest(selector);
				}
				return parents;
			},
			prev(element, selector) {
				let previous = element.previousElementSibling;
				while (previous) {
					if (previous.matches(selector)) return [previous];
					previous = previous.previousElementSibling;
				}
				return [];
			},
			next(element, selector) {
				let next = element.nextElementSibling;
				while (next) {
					if (next.matches(selector)) return [next];
					next = next.nextElementSibling;
				}
				return [];
			},
			focusableChildren(element) {
				const focusables = [
					"a",
					"button",
					"input",
					"textarea",
					"select",
					"details",
					"[tabindex]",
					"[contenteditable=\"true\"]"
				].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
				return this.find(focusables, element).filter((el) => !index_js.isDisabled(el) && index_js.isVisible(el));
			},
			getSelectorFromElement(element) {
				const selector = getSelector(element);
				if (selector) return SelectorEngine.findOne(selector) ? selector : null;
				return null;
			},
			getElementFromSelector(element) {
				const selector = getSelector(element);
				return selector ? SelectorEngine.findOne(selector) : null;
			},
			getMultipleElementsFromSelector(element) {
				const selector = getSelector(element);
				return selector ? SelectorEngine.find(selector) : [];
			}
		};
		return SelectorEngine;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/backdrop.js
var require_backdrop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap backdrop.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_config(), require_util()) : typeof define === "function" && define.amd ? define([
			"../dom/event-handler",
			"./config",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Backdrop = factory(global.EventHandler, global.Config, global.Index));
	})(exports, (function(EventHandler, Config, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/backdrop.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "backdrop";
		const CLASS_NAME_FADE = "fade";
		const CLASS_NAME_SHOW = "show";
		const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`;
		const Default = {
			className: "modal-backdrop",
			clickCallback: null,
			isAnimated: false,
			isVisible: true,
			rootElement: "body"
		};
		const DefaultType = {
			className: "string",
			clickCallback: "(function|null)",
			isAnimated: "boolean",
			isVisible: "boolean",
			rootElement: "(element|string)"
		};
		/**
		* Class definition
		*/
		class Backdrop extends Config {
			constructor(config) {
				super();
				this._config = this._getConfig(config);
				this._isAppended = false;
				this._element = null;
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			show(callback) {
				if (!this._config.isVisible) {
					index_js.execute(callback);
					return;
				}
				this._append();
				const element = this._getElement();
				if (this._config.isAnimated) index_js.reflow(element);
				element.classList.add(CLASS_NAME_SHOW);
				this._emulateAnimation(() => {
					index_js.execute(callback);
				});
			}
			hide(callback) {
				if (!this._config.isVisible) {
					index_js.execute(callback);
					return;
				}
				this._getElement().classList.remove(CLASS_NAME_SHOW);
				this._emulateAnimation(() => {
					this.dispose();
					index_js.execute(callback);
				});
			}
			dispose() {
				if (!this._isAppended) return;
				EventHandler.off(this._element, EVENT_MOUSEDOWN);
				this._element.remove();
				this._isAppended = false;
			}
			_getElement() {
				if (!this._element) {
					const backdrop = document.createElement("div");
					backdrop.className = this._config.className;
					if (this._config.isAnimated) backdrop.classList.add(CLASS_NAME_FADE);
					this._element = backdrop;
				}
				return this._element;
			}
			_configAfterMerge(config) {
				config.rootElement = index_js.getElement(config.rootElement);
				return config;
			}
			_append() {
				if (this._isAppended) return;
				const element = this._getElement();
				this._config.rootElement.append(element);
				EventHandler.on(element, EVENT_MOUSEDOWN, () => {
					index_js.execute(this._config.clickCallback);
				});
				this._isAppended = true;
			}
			_emulateAnimation(callback) {
				index_js.executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
			}
		}
		return Backdrop;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/component-functions.js
var require_component_functions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap component-functions.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_event_handler(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"exports",
			"../dom/event-handler",
			"../dom/selector-engine",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.ComponentFunctions = {}, global.EventHandler, global.SelectorEngine, global.Index));
	})(exports, (function(exports$1, EventHandler, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/component-functions.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		const enableDismissTrigger = (component, method = "hide") => {
			const clickEvent = `click.dismiss${component.EVENT_KEY}`;
			const name = component.NAME;
			EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event) {
				if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
				if (index_js.isDisabled(this)) return;
				const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
				component.getOrCreateInstance(target)[method]();
			});
		};
		exports$1.enableDismissTrigger = enableDismissTrigger;
		Object.defineProperty(exports$1, Symbol.toStringTag, { value: "Module" });
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/focustrap.js
var require_focustrap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap focustrap.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_event_handler(), require_selector_engine(), require_config()) : typeof define === "function" && define.amd ? define([
			"../dom/event-handler",
			"../dom/selector-engine",
			"./config"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Focustrap = factory(global.EventHandler, global.SelectorEngine, global.Config));
	})(exports, (function(EventHandler, SelectorEngine, Config) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/focustrap.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "focustrap";
		const EVENT_KEY = `.bs.focustrap`;
		const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
		const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`;
		const TAB_KEY = "Tab";
		const TAB_NAV_FORWARD = "forward";
		const TAB_NAV_BACKWARD = "backward";
		const Default = {
			autofocus: true,
			trapElement: null
		};
		const DefaultType = {
			autofocus: "boolean",
			trapElement: "element"
		};
		/**
		* Class definition
		*/
		class FocusTrap extends Config {
			constructor(config) {
				super();
				this._config = this._getConfig(config);
				this._isActive = false;
				this._lastTabNavDirection = null;
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			activate() {
				if (this._isActive) return;
				if (this._config.autofocus) this._config.trapElement.focus();
				EventHandler.off(document, EVENT_KEY);
				EventHandler.on(document, EVENT_FOCUSIN, (event) => this._handleFocusin(event));
				EventHandler.on(document, EVENT_KEYDOWN_TAB, (event) => this._handleKeydown(event));
				this._isActive = true;
			}
			deactivate() {
				if (!this._isActive) return;
				this._isActive = false;
				EventHandler.off(document, EVENT_KEY);
			}
			_handleFocusin(event) {
				const { trapElement } = this._config;
				if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) return;
				const elements = SelectorEngine.focusableChildren(trapElement);
				if (elements.length === 0) trapElement.focus();
				else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) elements[elements.length - 1].focus();
				else elements[0].focus();
			}
			_handleKeydown(event) {
				if (event.key !== TAB_KEY) return;
				this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
			}
		}
		return FocusTrap;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/util/scrollbar.js
var require_scrollbar = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap scrollbar.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_manipulator(), require_selector_engine(), require_util()) : typeof define === "function" && define.amd ? define([
			"../dom/manipulator",
			"../dom/selector-engine",
			"./index"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Scrollbar = factory(global.Manipulator, global.SelectorEngine, global.Index));
	})(exports, (function(Manipulator, SelectorEngine, index_js) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap util/scrollBar.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
		const SELECTOR_STICKY_CONTENT = ".sticky-top";
		const PROPERTY_PADDING = "padding-right";
		const PROPERTY_MARGIN = "margin-right";
		/**
		* Class definition
		*/
		class ScrollBarHelper {
			constructor() {
				this._element = document.body;
			}
			getWidth() {
				const documentWidth = document.documentElement.clientWidth;
				return Math.abs(window.innerWidth - documentWidth);
			}
			hide() {
				const width = this.getWidth();
				this._disableOverFlow();
				this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
				this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
				this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
			}
			reset() {
				this._resetElementAttributes(this._element, "overflow");
				this._resetElementAttributes(this._element, PROPERTY_PADDING);
				this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
				this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
			}
			isOverflowing() {
				return this.getWidth() > 0;
			}
			_disableOverFlow() {
				this._saveInitialAttribute(this._element, "overflow");
				this._element.style.overflow = "hidden";
			}
			_setElementAttributes(selector, styleProperty, callback) {
				const scrollbarWidth = this.getWidth();
				const manipulationCallBack = (element) => {
					if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) return;
					this._saveInitialAttribute(element, styleProperty);
					const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
					element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
				};
				this._applyManipulationCallback(selector, manipulationCallBack);
			}
			_saveInitialAttribute(element, styleProperty) {
				const actualValue = element.style.getPropertyValue(styleProperty);
				if (actualValue) Manipulator.setDataAttribute(element, styleProperty, actualValue);
			}
			_resetElementAttributes(selector, styleProperty) {
				const manipulationCallBack = (element) => {
					const value = Manipulator.getDataAttribute(element, styleProperty);
					if (value === null) {
						element.style.removeProperty(styleProperty);
						return;
					}
					Manipulator.removeDataAttribute(element, styleProperty);
					element.style.setProperty(styleProperty, value);
				};
				this._applyManipulationCallback(selector, manipulationCallBack);
			}
			_applyManipulationCallback(selector, callBack) {
				if (index_js.isElement(selector)) {
					callBack(selector);
					return;
				}
				for (const sel of SelectorEngine.find(selector, this._element)) callBack(sel);
			}
		}
		return ScrollBarHelper;
	}));
}));
//#endregion
//#region node_modules/bootstrap/js/dist/modal.js
var require_modal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Bootstrap modal.js v5.3.8 (https://getbootstrap.com/)
	* Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require_base_component(), require_event_handler(), require_selector_engine(), require_backdrop(), require_component_functions(), require_focustrap(), require_util(), require_scrollbar()) : typeof define === "function" && define.amd ? define([
			"./base-component",
			"./dom/event-handler",
			"./dom/selector-engine",
			"./util/backdrop",
			"./util/component-functions",
			"./util/focustrap",
			"./util/index",
			"./util/scrollbar"
		], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Modal = factory(global.BaseComponent, global.EventHandler, global.SelectorEngine, global.Backdrop, global.ComponentFunctions, global.Focustrap, global.Index, global.Scrollbar));
	})(exports, (function(BaseComponent, EventHandler, SelectorEngine, Backdrop, componentFunctions_js, FocusTrap, index_js, ScrollBarHelper) {
		"use strict";
		/**
		* --------------------------------------------------------------------------
		* Bootstrap modal.js
		* Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		* --------------------------------------------------------------------------
		*/
		/**
		* Constants
		*/
		const NAME = "modal";
		const EVENT_KEY = `.bs.modal`;
		const DATA_API_KEY = ".data-api";
		const ESCAPE_KEY = "Escape";
		const EVENT_HIDE = `hide${EVENT_KEY}`;
		const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
		const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		const EVENT_SHOW = `show${EVENT_KEY}`;
		const EVENT_SHOWN = `shown${EVENT_KEY}`;
		const EVENT_RESIZE = `resize${EVENT_KEY}`;
		const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
		const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
		const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
		const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		const CLASS_NAME_OPEN = "modal-open";
		const CLASS_NAME_FADE = "fade";
		const CLASS_NAME_SHOW = "show";
		const CLASS_NAME_STATIC = "modal-static";
		const OPEN_SELECTOR = ".modal.show";
		const SELECTOR_DIALOG = ".modal-dialog";
		const SELECTOR_MODAL_BODY = ".modal-body";
		const SELECTOR_DATA_TOGGLE = "[data-bs-toggle=\"modal\"]";
		const Default = {
			backdrop: true,
			focus: true,
			keyboard: true
		};
		const DefaultType = {
			backdrop: "(boolean|string)",
			focus: "boolean",
			keyboard: "boolean"
		};
		/**
		* Class definition
		*/
		class Modal extends BaseComponent {
			constructor(element, config) {
				super(element, config);
				this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
				this._backdrop = this._initializeBackDrop();
				this._focustrap = this._initializeFocusTrap();
				this._isShown = false;
				this._isTransitioning = false;
				this._scrollBar = new ScrollBarHelper();
				this._addEventListeners();
			}
			static get Default() {
				return Default;
			}
			static get DefaultType() {
				return DefaultType;
			}
			static get NAME() {
				return NAME;
			}
			toggle(relatedTarget) {
				return this._isShown ? this.hide() : this.show(relatedTarget);
			}
			show(relatedTarget) {
				if (this._isShown || this._isTransitioning) return;
				if (EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget }).defaultPrevented) return;
				this._isShown = true;
				this._isTransitioning = true;
				this._scrollBar.hide();
				document.body.classList.add(CLASS_NAME_OPEN);
				this._adjustDialog();
				this._backdrop.show(() => this._showElement(relatedTarget));
			}
			hide() {
				if (!this._isShown || this._isTransitioning) return;
				if (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented) return;
				this._isShown = false;
				this._isTransitioning = true;
				this._focustrap.deactivate();
				this._element.classList.remove(CLASS_NAME_SHOW);
				this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
			}
			dispose() {
				EventHandler.off(window, EVENT_KEY);
				EventHandler.off(this._dialog, EVENT_KEY);
				this._backdrop.dispose();
				this._focustrap.deactivate();
				super.dispose();
			}
			handleUpdate() {
				this._adjustDialog();
			}
			_initializeBackDrop() {
				return new Backdrop({
					isVisible: Boolean(this._config.backdrop),
					isAnimated: this._isAnimated()
				});
			}
			_initializeFocusTrap() {
				return new FocusTrap({ trapElement: this._element });
			}
			_showElement(relatedTarget) {
				if (!document.body.contains(this._element)) document.body.append(this._element);
				this._element.style.display = "block";
				this._element.removeAttribute("aria-hidden");
				this._element.setAttribute("aria-modal", true);
				this._element.setAttribute("role", "dialog");
				this._element.scrollTop = 0;
				const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
				if (modalBody) modalBody.scrollTop = 0;
				index_js.reflow(this._element);
				this._element.classList.add(CLASS_NAME_SHOW);
				const transitionComplete = () => {
					if (this._config.focus) this._focustrap.activate();
					this._isTransitioning = false;
					EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget });
				};
				this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
			}
			_addEventListeners() {
				EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
					if (event.key !== ESCAPE_KEY) return;
					if (this._config.keyboard) {
						this.hide();
						return;
					}
					this._triggerBackdropTransition();
				});
				EventHandler.on(window, EVENT_RESIZE, () => {
					if (this._isShown && !this._isTransitioning) this._adjustDialog();
				});
				EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event) => {
					EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event2) => {
						if (this._element !== event.target || this._element !== event2.target) return;
						if (this._config.backdrop === "static") {
							this._triggerBackdropTransition();
							return;
						}
						if (this._config.backdrop) this.hide();
					});
				});
			}
			_hideModal() {
				this._element.style.display = "none";
				this._element.setAttribute("aria-hidden", true);
				this._element.removeAttribute("aria-modal");
				this._element.removeAttribute("role");
				this._isTransitioning = false;
				this._backdrop.hide(() => {
					document.body.classList.remove(CLASS_NAME_OPEN);
					this._resetAdjustments();
					this._scrollBar.reset();
					EventHandler.trigger(this._element, EVENT_HIDDEN);
				});
			}
			_isAnimated() {
				return this._element.classList.contains(CLASS_NAME_FADE);
			}
			_triggerBackdropTransition() {
				if (EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED).defaultPrevented) return;
				const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
				const initialOverflowY = this._element.style.overflowY;
				if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) return;
				if (!isModalOverflowing) this._element.style.overflowY = "hidden";
				this._element.classList.add(CLASS_NAME_STATIC);
				this._queueCallback(() => {
					this._element.classList.remove(CLASS_NAME_STATIC);
					this._queueCallback(() => {
						this._element.style.overflowY = initialOverflowY;
					}, this._dialog);
				}, this._dialog);
				this._element.focus();
			}
			/**
			* The following methods are used to handle overflowing modals
			*/
			_adjustDialog() {
				const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
				const scrollbarWidth = this._scrollBar.getWidth();
				const isBodyOverflowing = scrollbarWidth > 0;
				if (isBodyOverflowing && !isModalOverflowing) {
					const property = index_js.isRTL() ? "paddingLeft" : "paddingRight";
					this._element.style[property] = `${scrollbarWidth}px`;
				}
				if (!isBodyOverflowing && isModalOverflowing) {
					const property = index_js.isRTL() ? "paddingRight" : "paddingLeft";
					this._element.style[property] = `${scrollbarWidth}px`;
				}
			}
			_resetAdjustments() {
				this._element.style.paddingLeft = "";
				this._element.style.paddingRight = "";
			}
			static jQueryInterface(config, relatedTarget) {
				return this.each(function() {
					const data = Modal.getOrCreateInstance(this, config);
					if (typeof config !== "string") return;
					if (typeof data[config] === "undefined") throw new TypeError(`No method named "${config}"`);
					data[config](relatedTarget);
				});
			}
		}
		/**
		* Data API implementation
		*/
		EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event) {
			const target = SelectorEngine.getElementFromSelector(this);
			if (["A", "AREA"].includes(this.tagName)) event.preventDefault();
			EventHandler.one(target, EVENT_SHOW, (showEvent) => {
				if (showEvent.defaultPrevented) return;
				EventHandler.one(target, EVENT_HIDDEN, () => {
					if (index_js.isVisible(this)) this.focus();
				});
			});
			const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
			if (alreadyOpen) Modal.getInstance(alreadyOpen).hide();
			Modal.getOrCreateInstance(target).toggle(this);
		});
		componentFunctions_js.enableDismissTrigger(Modal);
		/**
		* jQuery
		*/
		index_js.defineJQueryPlugin(Modal);
		return Modal;
	}));
}));
//#endregion
export default require_modal();

//# sourceMappingURL=bootstrap_js_dist_modal.js.map