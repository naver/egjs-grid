/*
Copyright (c) 2020-present NAVER Corp.
name: @egjs/grid
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-grid
version: 0.1.1
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Grid = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };
    function __decorate(decorators, target, key, desc) {
      var c = arguments.length,
          r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
          d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    /** @deprecated */

    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    /*
    Copyright (c) NAVER Corp.
    name: @egjs/component
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-component
    version: 3.0.1
    */
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;

      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }

      return ar;
    }
    function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

      return ar;
    }

    /*
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    var isUndefined = function (value) {
      return typeof value === "undefined";
    };

    /**
     * Event class to provide additional properties
     * @ko Component에서 추가적인 프로퍼티를 제공하는 이벤트 클래스
     */

    var ComponentEvent =
    /*#__PURE__*/
    function () {
      /**
       * Create a new instance of ComponentEvent.
       * @ko ComponentEvent의 새로운 인스턴스를 생성한다.
       * @param eventType The name of the event.<ko>이벤트 이름.</ko>
       * @param props An object that contains additional event properties.<ko>추가적인 이벤트 프로퍼티 오브젝트.</ko>
       */
      function ComponentEvent(eventType, props) {
        var e_1, _a;

        this.eventType = eventType;
        this._canceled = false;
        if (!props) return;

        try {
          for (var _b = __values(Object.keys(props)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            this[key] = props[key];
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
      /**
       * Stop the event. {@link ComponentEvent#isCanceled} will return `true` after.
       * @ko 이벤트를 중단한다. 이후 {@link ComponentEvent#isCanceled}가 `true`를 반환한다.
       */


      var __proto = ComponentEvent.prototype;

      __proto.stop = function () {
        this._canceled = true;
      };
      /**
       * Returns a boolean value that indicates whether {@link ComponentEvent#stop} is called before.
       * @ko {@link ComponentEvent#stop}이 호출되었는지 여부를 반환한다.
       * @return {boolean} A boolean value that indicates whether {@link ComponentEvent#stop} is called before.<ko>이전에 {@link ComponentEvent#stop}이 불려졌는지 여부를 반환한다.</ko>
       */


      __proto.isCanceled = function () {
        return this._canceled;
      };

      return ComponentEvent;
    }();

    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     */

    var Component =
    /*#__PURE__*/
    function () {
      /**
       * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
       */
      function Component() {
        this._eventHandler = {};
      }
      /**
       * Trigger a custom event.
       * @ko 커스텀 이벤트를 발생시킨다
       * @param {string | ComponentEvent} event The name of the custom event to be triggered or an instance of the ComponentEvent<ko>발생할 커스텀 이벤트의 이름 또는 ComponentEvent의 인스턴스</ko>
       * @param {any[]} params Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
       * @return An instance of the component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   beforeHi: ComponentEvent<{ foo: number; bar: string }>;
       *   hi: { foo: { a: number; b: boolean } };
       *   someEvent: (foo: number, bar: string) => void;
       *   someOtherEvent: void; // When there's no event argument
       * }> {
       *   some(){
       *     if(this.trigger("beforeHi")){ // When event call to stop return false.
       *       this.trigger("hi");// fire hi event.
       *     }
       *   }
       * }
       *
       * const some = new Some();
       * some.on("beforeHi", e => {
       *   if(condition){
       *     e.stop(); // When event call to stop, `hi` event not call.
       *   }
       *   // `currentTarget` is component instance.
       *   console.log(some === e.currentTarget); // true
       *
       *   typeof e.foo; // number
       *   typeof e.bar; // string
       * });
       * some.on("hi", e => {
       *   typeof e.foo.b; // boolean
       * });
       * // If you want to more know event design. You can see article.
       * // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
       * ```
       */


      var __proto = Component.prototype;

      __proto.trigger = function (event) {
        var params = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          params[_i - 1] = arguments[_i];
        }

        var eventName = event instanceof ComponentEvent ? event.eventType : event;

        var handlers = __spread(this._eventHandler[eventName] || []);

        if (handlers.length <= 0) {
          return this;
        }

        if (event instanceof ComponentEvent) {
          event.currentTarget = this;
          handlers.forEach(function (handler) {
            handler(event);
          });
        } else {
          handlers.forEach(function (handler) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            handler.apply(void 0, __spread(params));
          });
        }

        return this;
      };
      /**
       * Executed event just one time.
       * @ko 이벤트가 한번만 실행된다.
       * @param {string} eventName The name of the event to be attached or an event name - event handler mapped object.<ko>등록할 이벤트의 이름 또는 이벤트 이름-핸들러 오브젝트</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of the component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: ComponentEvent;
       * }> {
       *   hi() {
       *     alert("hi");
       *   }
       *   thing() {
       *     this.once("hi", this.hi);
       *   }
       * }
       *
       * var some = new Some();
       * some.thing();
       * some.trigger(new ComponentEvent("hi"));
       * // fire alert("hi");
       * some.trigger(new ComponentEvent("hi"));
       * // Nothing happens
       * ```
       */


      __proto.once = function (eventName, handlerToAttach) {
        var _this = this;

        if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
          var eventHash = eventName;

          for (var key in eventHash) {
            this.once(key, eventHash[key]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var listener_1 = function () {
            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            } // eslint-disable-next-line @typescript-eslint/no-unsafe-call


            handlerToAttach.apply(void 0, __spread(args));

            _this.off(eventName, listener_1);
          };

          this.on(eventName, listener_1);
        }

        return this;
      };
      /**
       * Checks whether an event has been attached to a component.
       * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
       * @param {string} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
       * @return {boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
       * @example
       * ```ts
       * import Component from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   some() {
       *     this.hasOn("hi");// check hi event.
       *   }
       * }
       * ```
       */


      __proto.hasOn = function (eventName) {
        return !!this._eventHandler[eventName];
      };
      /**
       * Attaches an event to a component.
       * @ko 컴포넌트에 이벤트를 등록한다.
       * @param {string} eventName The name of the event to be attached or an event name - event handler mapped object.<ko>등록할 이벤트의 이름 또는 이벤트 이름-핸들러 오브젝트</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.on("hi",this.hi); //attach event
       *   }
       * }
       * ```
       */


      __proto.on = function (eventName, handlerToAttach) {
        if (typeof eventName === "object" && isUndefined(handlerToAttach)) {
          var eventHash = eventName;

          for (var name in eventHash) {
            this.on(name, eventHash[name]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var handlerList = this._eventHandler[eventName];

          if (isUndefined(handlerList)) {
            this._eventHandler[eventName] = [];
            handlerList = this._eventHandler[eventName];
          }

          handlerList.push(handlerToAttach);
        }

        return this;
      };
      /**
       * Detaches an event from the component.<br/>If the `eventName` is not given this will detach all event handlers attached.<br/>If the `handlerToDetach` is not given, this will detach all event handlers for `eventName`.
       * @ko 컴포넌트에 등록된 이벤트를 해제한다.<br/>`eventName`이 주어지지 않았을 경우 모든 이벤트 핸들러를 제거한다.<br/>`handlerToAttach`가 주어지지 않았을 경우 `eventName`에 해당하는 모든 이벤트 핸들러를 제거한다.
       * @param {string?} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
       * @param {function?} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```ts
       * import Component, { ComponentEvent } from "@egjs/component";
       *
       * class Some extends Component<{
       *   hi: void;
       * }> {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.off("hi",this.hi); //detach event
       *   }
       * }
       * ```
       */


      __proto.off = function (eventName, handlerToDetach) {
        var e_1, _a; // Detach all event handlers.


        if (isUndefined(eventName)) {
          this._eventHandler = {};
          return this;
        } // Detach all handlers for eventname or detach event handlers by object.


        if (isUndefined(handlerToDetach)) {
          if (typeof eventName === "string") {
            delete this._eventHandler[eventName];
            return this;
          } else {
            var eventHash = eventName;

            for (var name in eventHash) {
              this.off(name, eventHash[name]);
            }

            return this;
          }
        } // Detach single event handler


        var handlerList = this._eventHandler[eventName];

        if (handlerList) {
          var idx = 0;

          try {
            for (var handlerList_1 = __values(handlerList), handlerList_1_1 = handlerList_1.next(); !handlerList_1_1.done; handlerList_1_1 = handlerList_1.next()) {
              var handlerFunction = handlerList_1_1.value;

              if (handlerFunction === handlerToDetach) {
                handlerList.splice(idx, 1);

                if (handlerList.length <= 0) {
                  delete this._eventHandler[eventName];
                }

                break;
              }

              idx++;
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (handlerList_1_1 && !handlerList_1_1.done && (_a = handlerList_1.return)) _a.call(handlerList_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        return this;
      };
      /**
       * Version info string
       * @ko 버전정보 문자열
       * @name VERSION
       * @static
       * @example
       * Component.VERSION;  // ex) 3.0.0
       * @memberof Component
       */


      Component.VERSION = "3.0.1";
      return Component;
    }();

    var DEFAULT_GRID_OPTIONS = {
      horizontal: false,
      useTransform: false,
      percentage: false,
      isEqualSize: false,
      isConstantSize: false,
      gap: 0,
      attributePrefix: "data-grid-",
      resizeDebounce: 100,
      maxResizeDebounce: 0,
      autoResize: true,
      defaultDirection: "end",
      externalContainerManager: null,
      externalItemRenderer: null,
      useRenderProperty: true
    };
    var PROPERTY_TYPE;

    (function (PROPERTY_TYPE) {
      PROPERTY_TYPE[PROPERTY_TYPE["PROPERTY"] = 1] = "PROPERTY";
      PROPERTY_TYPE[PROPERTY_TYPE["RENDER_PROPERTY"] = 2] = "RENDER_PROPERTY";
    })(PROPERTY_TYPE || (PROPERTY_TYPE = {}));

    var MOUNT_STATE;

    (function (MOUNT_STATE) {
      MOUNT_STATE[MOUNT_STATE["UNCHECKED"] = 1] = "UNCHECKED";
      MOUNT_STATE[MOUNT_STATE["UNMOUNTED"] = 2] = "UNMOUNTED";
      MOUNT_STATE[MOUNT_STATE["MOUNTED"] = 3] = "MOUNTED";
    })(MOUNT_STATE || (MOUNT_STATE = {}));

    var UPDATE_STATE;

    (function (UPDATE_STATE) {
      UPDATE_STATE[UPDATE_STATE["NEED_UPDATE"] = 1] = "NEED_UPDATE";
      UPDATE_STATE[UPDATE_STATE["WAIT_LOADING"] = 2] = "WAIT_LOADING";
      UPDATE_STATE[UPDATE_STATE["UPDATED"] = 3] = "UPDATED";
    })(UPDATE_STATE || (UPDATE_STATE = {}));

    var GRID_PROPERTY_TYPES = {
      gap: PROPERTY_TYPE.RENDER_PROPERTY,
      defaultDirection: PROPERTY_TYPE.PROPERTY,
      useRenderProperty: PROPERTY_TYPE.PROPERTY
    };
    var GRID_METHODS = ["syncElements", "updateItems", "getItems", "setItems", "renderItems", "getContainerInlineSize"];
    var GRID_EVENTS = ["renderComplete", "contentError"];
    var RECT_NAMES = {
      horizontal: {
        inlinePos: "top",
        contentPos: "left",
        inlineSize: "height",
        contentSize: "width"
      },
      vertical: {
        inlinePos: "left",
        contentPos: "top",
        inlineSize: "width",
        contentSize: "height"
      }
    };

    var ContainerManager =
    /*#__PURE__*/
    function () {
      function ContainerManager(container, options) {
        this.container = container;
        this.options = __assign({
          horizontal: DEFAULT_GRID_OPTIONS.horizontal
        }, options);

        this._init();
      }

      var __proto = ContainerManager.prototype;

      __proto.resize = function () {
        var container = this.container;
        this.setRect({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      };

      __proto.getRect = function () {
        return this.rect;
      };

      __proto.setRect = function (rect) {
        this.rect = __assign({}, rect);
      };

      __proto.getInlineSize = function () {
        return this.rect[this.options.horizontal ? "height" : "width"];
      };

      __proto.getContentSize = function () {
        return this.rect[this.options.horizontal ? "width" : "height"];
      };

      __proto.getStatus = function () {
        return {
          rect: __assign({}, this.rect)
        };
      };

      __proto.setStatus = function (status) {
        this.rect = __assign({}, status.rect);
        this.setContentSize(this.getContentSize());
      };

      __proto.setContentSize = function (size) {
        var sizeName = this.options.horizontal ? "width" : "height";
        this.rect[sizeName] = size;
        this.container.style[sizeName] = size + "px";
      };

      __proto.destroy = function (options) {
        if (options === void 0) {
          options = {};
        }

        if (!options.preserveUI) {
          this.container.style.cssText = this.orgCSSText;
        }
      };

      __proto._init = function () {
        var container = this.container;
        var style = window.getComputedStyle(container);
        this.orgCSSText = container.style.cssText;

        if (style.position === "static") {
          container.style.position = "relative";
        }
      };

      return ContainerManager;
    }();

    /*
    Copyright (c) NAVER Corp.
    name: @egjs/component
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-component
    version: 2.2.2
    */
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __values$1(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /*
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */

    function isUndefined$1(value) {
      return typeof value === "undefined";
    }
    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     * @alias eg.Component
     */


    var Component$1 =
    /*#__PURE__*/
    function () {
      /**
       * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
       */
      function Component() {
        /**
         * @deprecated
         * @private
         */
        this.options = {};
        this._eventHandler = {};
      }
      /**
       * Triggers a custom event.
       * @ko 커스텀 이벤트를 발생시킨다
       * @param {string} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
       * @param {object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
       * @param {any[]} restParam Additional parameters when triggering a custom event <ko>커스텀 이벤트가 발생할 때 필요시 추가적으로 전달할 데이터</ko>
       * @return Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">Ref</a> <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">참고</a></ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   some(){
       *     if(this.trigger("beforeHi")){ // When event call to stop return false.
       *       this.trigger("hi");// fire hi event.
       *     }
       *   }
       * }
       *
       * const some = new Some();
       * some.on("beforeHi", (e) => {
       *   if(condition){
       *     e.stop(); // When event call to stop, `hi` event not call.
       *   }
       * });
       * some.on("hi", (e) => {
       *   // `currentTarget` is component instance.
       *   console.log(some === e.currentTarget); // true
       * });
       * // If you want to more know event design. You can see article.
       * // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
       * ```
       */


      var __proto = Component.prototype;

      __proto.trigger = function (eventName) {
        var _this = this;

        var params = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          params[_i - 1] = arguments[_i];
        }

        var handlerList = this._eventHandler[eventName] || [];
        var hasHandlerList = handlerList.length > 0;

        if (!hasHandlerList) {
          return true;
        }

        var customEvent = params[0] || {};
        var restParams = params.slice(1); // If detach method call in handler in first time then handler list calls.

        handlerList = handlerList.concat();
        var isCanceled = false; // This should be done like this to pass previous tests

        customEvent.eventType = eventName;

        customEvent.stop = function () {
          isCanceled = true;
        };

        customEvent.currentTarget = this;
        var arg = [customEvent];

        if (restParams.length >= 1) {
          arg = arg.concat(restParams);
        }

        handlerList.forEach(function (handler) {
          handler.apply(_this, arg);
        });
        return !isCanceled;
      };
      /**
       * Executed event just one time.
       * @ko 이벤트가 한번만 실행된다.
       * @param {string} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       * hi() {
       *   alert("hi");
       * }
       * thing() {
       *   this.once("hi", this.hi);
       * }
       *
       * var some = new Some();
       * some.thing();
       * some.trigger("hi");
       * // fire alert("hi");
       * some.trigger("hi");
       * // Nothing happens
       * ```
       */


      __proto.once = function (eventName, handlerToAttach) {
        var _this = this;

        if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
          var eventHash = eventName;

          for (var key in eventHash) {
            this.once(key, eventHash[key]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var listener_1 = function () {
            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }

            handlerToAttach.apply(_this, args);

            _this.off(eventName, listener_1);
          };

          this.on(eventName, listener_1);
        }

        return this;
      };
      /**
       * Checks whether an event has been attached to a component.
       * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
       * @param {string} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
       * @return {boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   some() {
       *     this.hasOn("hi");// check hi event.
       *   }
       * }
       * ```
       */


      __proto.hasOn = function (eventName) {
        return !!this._eventHandler[eventName];
      };
      /**
       * Attaches an event to a component.
       * @ko 컴포넌트에 이벤트를 등록한다.
       * @param {string} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
       * @param {function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.on("hi",this.hi); //attach event
       *   }
       * }
       * ```
       */


      __proto.on = function (eventName, handlerToAttach) {
        if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
          var eventHash = eventName;

          for (var name in eventHash) {
            this.on(name, eventHash[name]);
          }

          return this;
        } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
          var handlerList = this._eventHandler[eventName];

          if (isUndefined$1(handlerList)) {
            this._eventHandler[eventName] = [];
            handlerList = this._eventHandler[eventName];
          }

          handlerList.push(handlerToAttach);
        }

        return this;
      };
      /**
       * Detaches an event from the component.
       * @ko 컴포넌트에 등록된 이벤트를 해제한다
       * @param {string} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
       * @param {function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
       * @return An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
       * @example
       * ```
       * class Some extends eg.Component {
       *   hi() {
       *     console.log("hi");
       *   }
       *   some() {
       *     this.off("hi",this.hi); //detach event
       *   }
       * }
       * ```
       */


      __proto.off = function (eventName, handlerToDetach) {
        var e_1, _a; // Detach all event handlers.


        if (isUndefined$1(eventName)) {
          this._eventHandler = {};
          return this;
        } // Detach all handlers for eventname or detach event handlers by object.


        if (isUndefined$1(handlerToDetach)) {
          if (typeof eventName === "string") {
            delete this._eventHandler[eventName];
            return this;
          } else {
            var eventHash = eventName;

            for (var name in eventHash) {
              this.off(name, eventHash[name]);
            }

            return this;
          }
        } // Detach single event handler


        var handlerList = this._eventHandler[eventName];

        if (handlerList) {
          var idx = 0;

          try {
            for (var handlerList_1 = __values$1(handlerList), handlerList_1_1 = handlerList_1.next(); !handlerList_1_1.done; handlerList_1_1 = handlerList_1.next()) {
              var handlerFunction = handlerList_1_1.value;

              if (handlerFunction === handlerToDetach) {
                handlerList.splice(idx, 1);
                break;
              }

              idx++;
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (handlerList_1_1 && !handlerList_1_1.done && (_a = handlerList_1.return)) _a.call(handlerList_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }

        return this;
      };
      /**
       * Version info string
       * @ko 버전정보 문자열
       * @name VERSION
       * @static
       * @example
       * eg.Component.VERSION;  // ex) 2.0.0
       * @memberof eg.Component
       */


      Component.VERSION = "2.2.2";
      return Component;
    }();

    /*
    Copyright (c) 2020-present NAVER Corp.
    name: @egjs/imready
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-imready
    version: 1.1.2
    */

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };

      return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
      extendStatics$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1.apply(this, arguments);
    };
    function __spreadArrays$1() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

      return r;
    }

    /*
    egjs-imready
    Copyright (c) 2020-present NAVER Corp.
    MIT license
    */
    var isWindow = typeof window !== "undefined";
    var ua = isWindow ? window.navigator.userAgent : "";
    var SUPPORT_COMPUTEDSTYLE = isWindow ? !!("getComputedStyle" in window) : false;
    var IS_IE = /MSIE|Trident|Windows Phone|Edge/.test(ua);
    var SUPPORT_ADDEVENTLISTENER = isWindow ? !!("addEventListener" in document) : false;
    var WIDTH = "width";
    var HEIGHT = "height";

    function getAttribute(el, name) {
      return el.getAttribute(name) || "";
    }
    function toArray(arr) {
      return [].slice.call(arr);
    }
    function hasSizeAttribute(target, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      return !!target.getAttribute(prefix + "width");
    }
    function hasLoadingAttribute(target) {
      return "loading" in target && target.getAttribute("loading") === "lazy";
    }
    function hasSkipAttribute(target, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      return !!target.getAttribute(prefix + "skip");
    }
    function addEvent(element, type, handler) {
      if (SUPPORT_ADDEVENTLISTENER) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      } else {
        element["on" + type] = handler;
      }
    }
    function removeEvent(element, type, handler) {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
      } else {
        element["on" + type] = null;
      }
    }
    function innerWidth(el) {
      return getSize(el, "Width");
    }
    function innerHeight(el) {
      return getSize(el, "Height");
    }
    function getStyles(el) {
      return (SUPPORT_COMPUTEDSTYLE ? window.getComputedStyle(el) : el.currentStyle) || {};
    }

    function getSize(el, name) {
      var size = el["client" + name] || el["offset" + name];
      return parseFloat(size || getStyles(el)[name.toLowerCase()]) || 0;
    }

    function getContentElements(element, tags, prefix) {
      var skipElements = toArray(element.querySelectorAll(__spreadArrays$1(["[" + prefix + "skip] [" + prefix + "width]"], tags.map(function (tag) {
        return ["[" + prefix + "skip] " + tag, tag + "[" + prefix + "skip]", "[" + prefix + "width] " + tag].join(", ");
      })).join(", ")));
      return toArray(element.querySelectorAll("[" + prefix + "width], " + tags.join(", "))).filter(function (el) {
        return skipElements.indexOf(el) === -1;
      });
    }

    /*
    egjs-imready
    Copyright (c) 2020-present NAVER Corp.
    MIT license
    */
    var elements = [];
    function addAutoSizer(element, prefix) {
      !elements.length && addEvent(window, "resize", resizeAllAutoSizers);
      element.__PREFIX__ = prefix;
      elements.push(element);
      resize(element);
    }
    function removeAutoSizer(element, prefix) {
      var index = elements.indexOf(element);

      if (index < 0) {
        return;
      }

      var fixed = getAttribute(element, prefix + "fixed");
      delete element.__PREFIX__;
      element.style[fixed === HEIGHT ? WIDTH : HEIGHT] = "";
      elements.splice(index, 1);
      !elements.length && removeEvent(window, "resize", resizeAllAutoSizers);
    }

    function resize(element, prefix) {
      if (prefix === void 0) {
        prefix = "data-";
      }

      var elementPrefix = element.__PREFIX__ || prefix;
      var dataWidth = parseInt(getAttribute(element, "" + elementPrefix + WIDTH), 10) || 0;
      var dataHeight = parseInt(getAttribute(element, "" + elementPrefix + HEIGHT), 10) || 0;
      var fixed = getAttribute(element, elementPrefix + "fixed");

      if (fixed === HEIGHT) {
        var size = innerHeight(element) || dataHeight;
        element.style[WIDTH] = dataWidth / dataHeight * size + "px";
      } else {
        var size = innerWidth(element) || dataWidth;
        element.style[HEIGHT] = dataHeight / dataWidth * size + "px";
      }
    }

    function resizeAllAutoSizers() {
      elements.forEach(function (element) {
        resize(element);
      });
    }

    var Loader =
    /*#__PURE__*/
    function (_super) {
      __extends$1(Loader, _super);

      function Loader(element, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.isReady = false;
        _this.isPreReady = false;
        _this.hasDataSize = false;
        _this.hasLoading = false;
        _this.isSkip = false;

        _this.onCheck = function (e) {
          _this.clear();

          if (e && e.type === "error") {
            _this.onError(_this.element);
          } // I'm pre-ready and ready!


          var withPreReady = !_this.hasDataSize && !_this.hasLoading;

          _this.onReady(withPreReady);
        };

        _this.options = __assign$1({
          prefix: "data-"
        }, options);
        _this.element = element;
        _this.hasDataSize = hasSizeAttribute(element, _this.options.prefix);
        _this.hasLoading = hasLoadingAttribute(element);
        _this.isSkip = hasSkipAttribute(_this.element);
        return _this;
      }

      var __proto = Loader.prototype;

      __proto.check = function () {
        if (this.isSkip || !this.checkElement()) {
          // I'm Ready
          this.onAlreadyReady(true);
          return false;
        }

        if (this.hasDataSize) {
          addAutoSizer(this.element, this.options.prefix);
        }

        if (this.hasDataSize || this.hasLoading) {
          // I'm Pre Ready
          this.onAlreadyPreReady();
        } // Wati Pre Ready, Ready


        return true;
      };

      __proto.addEvents = function () {
        var _this = this;

        var element = this.element;
        this.constructor.EVENTS.forEach(function (name) {
          addEvent(element, name, _this.onCheck);
        });
      };

      __proto.clear = function () {
        var _this = this;

        var element = this.element;
        this.constructor.EVENTS.forEach(function (name) {
          removeEvent(element, name, _this.onCheck);
        });
        this.removeAutoSizer();
      };

      __proto.destroy = function () {
        this.clear();
        this.off();
      };

      __proto.removeAutoSizer = function () {
        if (this.hasDataSize) {
          // I'm already ready.
          var prefix = this.options.prefix;
          removeAutoSizer(this.element, prefix);
        }
      };

      __proto.onError = function (target) {
        this.trigger("error", {
          element: this.element,
          target: target
        });
      };

      __proto.onPreReady = function () {
        if (this.isPreReady) {
          return;
        }

        this.isPreReady = true;
        this.trigger("preReady", {
          element: this.element,
          hasLoading: this.hasLoading,
          isSkip: this.isSkip
        });
      };

      __proto.onReady = function (withPreReady) {
        if (this.isReady) {
          return;
        }

        if (withPreReady) {
          this.isPreReady = true;
        }

        this.removeAutoSizer();
        this.isReady = true;
        this.trigger("ready", {
          element: this.element,
          withPreReady: withPreReady,
          hasLoading: this.hasLoading,
          isSkip: this.isSkip
        });
      };

      __proto.onAlreadyError = function (target) {
        var _this = this;

        setTimeout(function () {
          _this.onError(target);
        });
      };

      __proto.onAlreadyPreReady = function () {
        var _this = this;

        setTimeout(function () {
          _this.onPreReady();
        });
      };

      __proto.onAlreadyReady = function (withPreReady) {
        var _this = this;

        setTimeout(function () {
          _this.onReady(withPreReady);
        });
      };

      Loader.EVENTS = [];
      return Loader;
    }(Component$1);

    var ElementLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ElementLoader, _super);

      function ElementLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ElementLoader.prototype;

      __proto.setHasLoading = function (hasLoading) {
        this.hasLoading = hasLoading;
      };

      __proto.check = function () {
        if (this.isSkip) {
          // I'm Ready
          this.onAlreadyReady(true);
          return false;
        }

        if (this.hasDataSize) {
          addAutoSizer(this.element, this.options.prefix);
          this.onAlreadyPreReady();
        } else {
          // has not data size
          this.trigger("requestChildren");
        }

        return true;
      };

      __proto.checkElement = function () {
        return true;
      };

      __proto.destroy = function () {
        this.clear();
        this.trigger("requestDestroy");
        this.off();
      };

      __proto.onAlreadyPreReady = function () {
        // has data size
        _super.prototype.onAlreadyPreReady.call(this);

        this.trigger("reqeustReadyChildren");
      };

      ElementLoader.EVENTS = [];
      return ElementLoader;
    }(Loader);

    /**
     * @alias eg.ImReady
     * @extends eg.Component
     */

    var ImReadyManager =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ImReadyManager, _super);
      /**
       * @param - ImReady's options
       */


      function ImReadyManager(options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.readyCount = 0;
        _this.preReadyCount = 0;
        _this.totalCount = 0;
        _this.totalErrorCount = 0;
        _this.isPreReadyOver = true;
        _this.elementInfos = [];
        _this.options = __assign$1({
          loaders: {},
          prefix: "data-"
        }, options);
        return _this;
      }
      /**
       * Checks whether elements are in the ready state.
       * @ko 엘리먼트가 준비 상태인지 체크한다.
       * @elements - Elements to check ready status. <ko> 준비 상태를 체크할 엘리먼트들.</ko>
       * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReadyElement: e => {
         *     // 1, 3
         *     // 2, 3
         *     // 3, 3
         *     console.log(e.preReadyCount, e.totalCount),
         *   },
         * });
         * ```
       */


      var __proto = ImReadyManager.prototype;

      __proto.check = function (elements) {
        var _this = this;

        var prefix = this.options.prefix;
        this.clear();
        this.elementInfos = toArray(elements).map(function (element, index) {
          var loader = _this.getLoader(element, {
            prefix: prefix
          });

          loader.check();
          loader.on("error", function (e) {
            _this.onError(index, e.target);
          }).on("preReady", function (e) {
            var info = _this.elementInfos[index];
            info.hasLoading = e.hasLoading;
            info.isSkip = e.isSkip;

            var isPreReady = _this.checkPreReady(index);

            _this.onPreReadyElement(index);

            isPreReady && _this.onPreReady();
          }).on("ready", function (_a) {
            var withPreReady = _a.withPreReady,
                hasLoading = _a.hasLoading,
                isSkip = _a.isSkip;
            var info = _this.elementInfos[index];
            info.hasLoading = hasLoading;
            info.isSkip = isSkip;

            var isPreReady = withPreReady && _this.checkPreReady(index);

            var isReady = _this.checkReady(index); // Pre-ready and ready occur simultaneously


            withPreReady && _this.onPreReadyElement(index);

            _this.onReadyElement(index);

            isPreReady && _this.onPreReady();
            isReady && _this.onReady();
          });
          return {
            loader: loader,
            element: element,
            hasLoading: false,
            hasError: false,
            isPreReady: false,
            isReady: false,
            isSkip: false
          };
        });
        var length = this.elementInfos.length;
        this.totalCount = length;

        if (!length) {
          setTimeout(function () {
            _this.onPreReady();

            _this.onReady();
          });
        }

        return this;
      };
      /**
       * Gets the total count of elements to be checked.
       * @ko 체크하는 element의 총 개수를 가져온다.
       */


      __proto.getTotalCount = function () {
        return this.totalCount;
      };
      /**
       * Whether the elements are all pre-ready. (all sizes are known)
       * @ko 엘리먼트들이 모두 사전 준비가 됐는지 (사이즈를 전부 알 수 있는지) 여부.
       */


      __proto.isPreReady = function () {
        return this.elementInfos.every(function (info) {
          return info.isPreReady;
        });
      };
      /**
       * Whether the elements are all ready.
       * @ko 엘리먼트들이 모두 준비가 됐는지 여부.
       */


      __proto.isReady = function () {
        return this.elementInfos.every(function (info) {
          return info.isReady;
        });
      };
      /**
       * Whether an error has occurred in the elements in the current state.
       * @ko 현재 상태에서 엘리먼트들이 에러가 발생했는지 여부.
       */


      __proto.hasError = function () {
        return this.totalErrorCount > 0;
      };
      /**
       * Clears events of elements being checked.
       * @ko 체크 중인 엘리먼트들의 이벤트를 해제 한다.
       */


      __proto.clear = function () {
        this.isPreReadyOver = false;
        this.totalCount = 0;
        this.preReadyCount = 0;
        this.readyCount = 0;
        this.totalErrorCount = 0;
        this.elementInfos.forEach(function (info) {
          if (!info.isReady && info.loader) {
            info.loader.destroy();
          }
        });
        this.elementInfos = [];
      };
      /**
       * Destory all events.
       * @ko 모든 이벤트를 해제 한다.
       */


      __proto.destroy = function () {
        this.clear();
        this.off();
      };

      __proto.getLoader = function (element, options) {
        var _this = this;

        var tagName = element.tagName.toLowerCase();
        var loaders = this.options.loaders;
        var tags = Object.keys(loaders);

        if (loaders[tagName]) {
          return new loaders[tagName](element, options);
        }

        var loader = new ElementLoader(element, options);
        var children = toArray(element.querySelectorAll(tags.join(", ")));
        loader.setHasLoading(children.some(function (el) {
          return hasLoadingAttribute(el);
        }));
        var withPreReady = false;
        var childrenImReady = this.clone().on("error", function (e) {
          loader.onError(e.target);
        }).on("ready", function () {
          loader.onReady(withPreReady);
        });
        loader.on("requestChildren", function () {
          // has not data size
          var contentElements = getContentElements(element, tags, _this.options.prefix);
          childrenImReady.check(contentElements).on("preReady", function (e) {
            withPreReady = e.isReady;

            if (!withPreReady) {
              loader.onPreReady();
            }
          });
        }).on("reqeustReadyChildren", function () {
          // has data size
          // loader call preReady
          // check only video, image elements
          childrenImReady.check(children);
        }).on("requestDestroy", function () {
          childrenImReady.destroy();
        });
        return loader;
      };

      __proto.clone = function () {
        return new ImReadyManager(__assign$1({}, this.options));
      };

      __proto.checkPreReady = function (index) {
        this.elementInfos[index].isPreReady = true;
        ++this.preReadyCount;

        if (this.preReadyCount < this.totalCount) {
          return false;
        }

        return true;
      };

      __proto.checkReady = function (index) {
        this.elementInfos[index].isReady = true;
        ++this.readyCount;

        if (this.readyCount < this.totalCount) {
          return false;
        }

        return true;
      };

      __proto.onError = function (index, target) {
        var info = this.elementInfos[index];
        info.hasError = true;
        /**
         * An event occurs if the image, video fails to load.
         * @ko 이미지, 비디오가 로딩에 실패하면 이벤트가 발생한다.
         * @event eg.ImReady#error
         * @param {eg.ImReady.OnError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {HTMLElement} [e.element] - The element with error images.<ko>오류난 이미지가 있는 엘리먼트</ko>
         * @param {number} [e.index] - The item's index with error images. <ko>오류난 이미지가 있는 엘리먼트의 인덱스</ko>
         * @param {HTMLElement} [e.target] - Error image target in element <ko>엘리먼트의 오류난 이미지 타겟</ko>
         * @param {number} [e.errorCount] - The number of elements with errors <ko>에러가 있는 엘리먼트들의 개수</ko>
         * @param {number} [e.totalErrorCount] - The total number of targets with errors <ko>에러가 있는 타겟들의 총 개수</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg"/>
         *    <img src="ERR"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check([document.querySelector("div")]).on({
         *   error: e => {
         *     // <div>...</div>, 0, <img src="ERR"/>
         *     console.log(e.element, e.index, e.target),
         *   },
         * });
         * ```
         */

        this.trigger("error", {
          element: info.element,
          index: index,
          target: target,
          errorCount: this.getErrorCount(),
          totalErrorCount: ++this.totalErrorCount
        });
      };

      __proto.onPreReadyElement = function (index) {
        var info = this.elementInfos[index];
        /**
         * An event occurs when the element is pre-ready (when the loading attribute is applied or the size is known)
         * @ko 해당 엘리먼트가 사전 준비되었을 때(loading 속성이 적용되었거나 사이즈를 알 수 있을 때) 이벤트가 발생한다.
         * @event eg.ImReady#preReadyElement
         * @param {eg.ImReady.OnPreReadyElement} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {HTMLElement} [e.element] - The pre-ready element.<ko>사전 준비된 엘리먼트</ko>
         * @param {number} [e.index] - The index of the pre-ready element. <ko>사전 준비된 엘리먼트의 인덱스</ko>
         * @param {number} [e.preReadyCount] - Number of elements pre-ready <ko>사전 준비된 엘리먼트들의 개수</ko>
         * @param {number} [e.readyCount] - Number of elements ready <ko>준비된 엘리먼트들의 개수</ko>
         * @param {number} [e.totalCount] - Total number of elements <ko>엘리먼트들의 총 개수</ko>
         * @param {boolean} [e.isPreReady] - Whether all elements are pre-ready <ko>모든 엘리먼트가 사전 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.isReady] - Whether all elements are ready <ko>모든 엘리먼트가 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.hasLoading] - Whether the loading attribute has been applied <ko>loading 속성이 적용되었는지 여부</ko>
         * @param {boolean} [e.isSkip] - Whether the check is omitted due to skip attribute <ko>skip 속성으로 인하여 체크가 생략됐는지 여부</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReadyElement: e => {
         *     // 1, 3
         *     // 2, 3
         *     // 3, 3
         *     console.log(e.preReadyCount, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger("preReadyElement", {
          element: info.element,
          index: index,
          preReadyCount: this.preReadyCount,
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isPreReady: this.isPreReady(),
          isReady: this.isReady(),
          hasLoading: info.hasLoading,
          isSkip: info.isSkip
        });
      };

      __proto.onPreReady = function () {
        this.isPreReadyOver = true;
        /**
         * An event occurs when all element are pre-ready (When all elements have the loading attribute applied or the size is known)
         * @ko 모든 엘리먼트들이 사전 준비된 경우 (모든 엘리먼트들이 loading 속성이 적용되었거나 사이즈를 알 수 있는 경우) 이벤트가 발생한다.
         * @event eg.ImReady#preReady
         * @param {eg.ImReady.OnPreReady} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {number} [e.readyCount] - Number of elements ready <ko>준비된 엘리먼트들의 개수</ko>
         * @param {number} [e.totalCount] - Total number of elements <ko>엘리먼트들의 총 개수</ko>
         * @param {boolean} [e.isReady] - Whether all elements are ready <ko>모든 엘리먼트가 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.hasLoading] - Whether the loading attribute has been applied <ko>loading 속성이 적용되었는지 여부</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReady: e => {
         *     // 0, 3
         *     console.log(e.readyCount, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger("preReady", {
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isReady: this.isReady(),
          hasLoading: this.hasLoading()
        });
      };

      __proto.onReadyElement = function (index) {
        var info = this.elementInfos[index];
        /**
         * An event occurs when the element is ready
         * @ko 해당 엘리먼트가 준비가 되었을 때 이벤트가 발생한다.
         * @event eg.ImReady#readyElement
         * @param {eg.ImReady.OnReadyElement} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {HTMLElement} [e.element] - The ready element.<ko>준비된 엘리먼트</ko>
         * @param {number} [e.index] - The index of the ready element. <ko>준비된 엘리먼트의 인덱스</ko>
         * @param {boolean} [e.hasError] - Whether there is an error in the element <ko>해당 엘리먼트에 에러가 있는지 여부</ko>
         * @param {number} [e.errorCount] - The number of elements with errors <ko>에러가 있는 엘리먼트들의 개수</ko>
         * @param {number} [e.totalErrorCount] - The total number of targets with errors <ko>에러가 있는 타겟들의 총 개수</ko>
         * @param {number} [e.preReadyCount] - Number of elements pre-ready <ko>사전 준비된 엘리먼트들의 개수</ko>
         * @param {number} [e.readyCount] - Number of elements ready <ko>준비된 엘리먼트들의 개수</ko>
         * @param {number} [e.totalCount] - Total number of elements <ko>엘리먼트들의 총 개수</ko>
         * @param {boolean} [e.isPreReady] - Whether all elements are pre-ready <ko>모든 엘리먼트가 사전 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.isReady] - Whether all elements are ready <ko>모든 엘리먼트가 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.hasLoading] - Whether the loading attribute has been applied <ko>loading 속성이 적용되었는지 여부</ko>
         * @param {boolean} [e.isPreReadyOver] - Whether pre-ready is over <ko>사전 준비가 끝났는지 여부</ko>
         * @param {boolean} [e.isSkip] - Whether the check is omitted due to skip attribute <ko>skip 속성으로 인하여 체크가 생략됐는지 여부</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   readyElement: e => {
         *     // 1, 0, false, 3
         *     // 2, 1, false, 3
         *     // 3, 2, true, 3
         *     console.log(e.readyCount, e.index, e.hasError, e.totalCount),
         *   },
         * });
         * ```
         */

        this.trigger("readyElement", {
          index: index,
          element: info.element,
          hasError: info.hasError,
          errorCount: this.getErrorCount(),
          totalErrorCount: this.totalErrorCount,
          preReadyCount: this.preReadyCount,
          readyCount: this.readyCount,
          totalCount: this.totalCount,
          isPreReady: this.isPreReady(),
          isReady: this.isReady(),
          hasLoading: info.hasLoading,
          isPreReadyOver: this.isPreReadyOver,
          isSkip: info.isSkip
        });
      };

      __proto.onReady = function () {
        /**
         * An event occurs when all element are ready
         * @ko 모든 엘리먼트들이 준비된 경우 이벤트가 발생한다.
         * @event eg.ImReady#ready
         * @param {eg.ImReady.OnReady} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {number} [e.errorCount] - The number of elements with errors <ko>에러가 있는 엘리먼트들의 개수</ko>
         * @param {number} [e.totalErrorCount] - The total number of targets with errors <ko>에러가 있는 타겟들의 총 개수</ko>
         * @param {number} [e.totalCount] - Total number of elements <ko>엘리먼트들의 총 개수</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg" data-width="1280" data-height="853"/>
         *    <img src="ERR" data-width="1280" data-height="853"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import ImReady from "@egjs/imready";
         *
         * const im = new ImReady(); // umd: eg.ImReady
         * im.check(document.querySelectorAll("img")).on({
         *   preReady: e => {
         *     // 0, 3
         *     console.log(e.readyCount, e.totalCount),
         *   },
         *   ready: e => {
         *     // 1, 3
         *     console.log(e.errorCount, e.totalCount),
         *   },
         * });
         * ```
         */
        this.trigger("ready", {
          errorCount: this.getErrorCount(),
          totalErrorCount: this.totalErrorCount,
          totalCount: this.totalCount
        });
      };

      __proto.getErrorCount = function () {
        return this.elementInfos.filter(function (info) {
          return info.hasError;
        }).length;
      };

      __proto.hasLoading = function () {
        return this.elementInfos.some(function (info) {
          return info.hasLoading;
        });
      };

      return ImReadyManager;
    }(Component$1);

    var ImageLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ImageLoader, _super);

      function ImageLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = ImageLoader.prototype;

      __proto.checkElement = function () {
        var element = this.element;
        var src = element.getAttribute("src");

        if (element.complete && src) {
          if (!element.naturalWidth) {
            this.onAlreadyError(element);
          }

          return false;
        }

        this.addEvents();
        IS_IE && element.setAttribute("src", src);
        return true;
      };

      ImageLoader.EVENTS = ["load", "error"];
      return ImageLoader;
    }(Loader);

    var VideoLoader =
    /*#__PURE__*/
    function (_super) {
      __extends$1(VideoLoader, _super);

      function VideoLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = VideoLoader.prototype;

      __proto.checkElement = function () {
        var element = this.element; // HAVE_NOTHING: 0, no information whether or not the audio/video is ready
        // HAVE_METADATA: 1, HAVE_METADATA - metadata for the audio/video is ready
        // HAVE_CURRENT_DATA: 2, data for the current playback position is available, but not enough data to play next frame/millisecond
        // HAVE_FUTURE_DATA: 3, data for the current and at least the next frame is available
        // HAVE_ENOUGH_DATA: 4, enough data available to start playing

        if (element.readyState >= 1) {
          return false;
        }

        if (element.error) {
          this.onAlreadyError(element);
          return false;
        }

        this.addEvents();
        return true;
      };

      VideoLoader.EVENTS = ["loadedmetadata", "error"];
      return VideoLoader;
    }(Loader);

    var ImReady =
    /*#__PURE__*/
    function (_super) {
      __extends$1(ImReady, _super);

      function ImReady(options) {
        if (options === void 0) {
          options = {};
        }

        return _super.call(this, __assign$1({
          loaders: {
            img: ImageLoader,
            video: VideoLoader
          }
        }, options)) || this;
      }

      return ImReady;
    }(ImReadyManager);

    function getKeys(obj) {
      return Object.keys(obj);
    }
    function isString(val) {
      return typeof val === "string";
    }
    function isObject(val) {
      return typeof val === "object";
    }
    function isNumber(val) {
      return typeof val === "number";
    }
    function camelize(str) {
      return str.replace(/[\s-_]([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
      });
    }
    function getDataAttributes(element, attributePrefix) {
      var dataAttributes = {};
      var attributes = element.attributes;
      var length = attributes.length;

      for (var i = 0; i < length; ++i) {
        var attribute = attributes[i];
        var name = attribute.name,
            value = attribute.value;

        if (name.indexOf(attributePrefix) === -1) {
          continue;
        }

        dataAttributes[camelize(name.replace(attributePrefix, ""))] = value;
      }

      return dataAttributes;
    }
    /* Class Decorator */

    function GetterSetter(component) {
      var prototype = component.prototype,
          propertyTypes = component.propertyTypes;

      var _loop_1 = function (name) {
        var shouldRender = propertyTypes[name] === PROPERTY_TYPE.RENDER_PROPERTY;
        var attributes = {
          enumerable: true,
          configurable: true,
          get: function () {
            return this.options[name];
          },
          set: function (value) {
            var options = this.options;
            var prevValue = options[name];

            if (prevValue === value) {
              return;
            }

            options[name] = value;

            if (shouldRender && options.useRenderProperty) {
              this.scheduleRender();
            }
          }
        };
        Object.defineProperty(prototype, name, attributes);
      };

      for (var name in propertyTypes) {
        _loop_1(name);
      }
    }
    function withMethods(methods) {
      return function (prototype, memberName) {
        methods.forEach(function (name) {
          if (name in prototype) {
            return;
          }

          prototype[name] = function () {
            var _a;

            var args = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }

            var result = (_a = this[memberName])[name].apply(_a, args); // fix `this` type to return your own `class` instance to the instance using the decorator.


            if (result === this[memberName]) {
              return this;
            } else {
              return result;
            }
          };
        });
      };
    }
    function range(length) {
      var arr = [];

      for (var i = 0; i < length; ++i) {
        arr.push(i);
      }

      return arr;
    }
    function getRangeCost(value, range) {
      return Math.max(value - range[1], range[0] - value, 0) + 1;
    }
    /**
     * Decorator that makes the method of grid available in the framework.
     * @ko 프레임워크에서 그리드의 메소드를 사용할 수 있게 하는 데코레이터.
     * @memberof eg.Grid
     * @private
     * @example
     * ```js
     * import { withGridMethods } from "@egjs/grid";
     *
     * class Grid extends React.Component<Partial<GridProps & GridOptions>> {
     *   &#64;withGridMethods
     *   private grid: NativeGrid;
     * }
     * ```
     */

    var withGridMethods = withMethods(GRID_METHODS);

    var ItemRenderer =
    /*#__PURE__*/
    function () {
      function ItemRenderer(options) {
        this.initialRect = null;
        this.sizePercetage = false;
        this.posPercetage = false;
        this.options = __assign({
          attributePrefix: DEFAULT_GRID_OPTIONS.attributePrefix,
          useTransform: DEFAULT_GRID_OPTIONS.useTransform,
          horizontal: DEFAULT_GRID_OPTIONS.horizontal,
          percentage: DEFAULT_GRID_OPTIONS.percentage,
          isEqualSize: DEFAULT_GRID_OPTIONS.isEqualSize,
          isConstantSize: DEFAULT_GRID_OPTIONS.isConstantSize
        }, options);

        this._init();
      }

      var __proto = ItemRenderer.prototype;

      __proto.resize = function () {
        this.initialRect = null;
      };

      __proto.renderItems = function (items) {
        var _this = this;

        items.forEach(function (item) {
          _this._renderItem(item);
        });
      };

      __proto.getInlineSize = function () {
        return this.containerRect[this.options.horizontal ? "height" : "width"];
      };

      __proto.setContainerRect = function (rect) {
        this.containerRect = rect;
      };

      __proto.updateItems = function (items) {
        var _this = this;

        items.forEach(function (item) {
          _this._updateItem(item);
        });
      };

      __proto.getStatus = function () {
        return {
          initialRect: this.initialRect
        };
      };

      __proto.setStatus = function (status) {
        this.initialRect = status.initialRect;
      };

      __proto._init = function () {
        var percentage = this.options.percentage;
        var sizePercentage = false;
        var posPercentage = false;

        if (percentage === true) {
          sizePercentage = true;
          posPercentage = true;
        } else if (percentage) {
          if (percentage.indexOf("position") > -1) {
            posPercentage = true;
          }

          if (percentage.indexOf("size") > -1) {
            sizePercentage = true;
          }
        }

        this.posPercetage = posPercentage;
        this.sizePercetage = sizePercentage;
      };

      __proto._updateItem = function (item) {
        var _a = this.options,
            isEqualSize = _a.isEqualSize,
            isConstantSize = _a.isConstantSize;
        var initialRect = this.initialRect;
        var orgRect = item.orgRect,
            element = item.element;
        var hasOrgRect = orgRect && orgRect.width && orgRect.height;
        var rect;

        if (isEqualSize && initialRect) {
          rect = initialRect;
        } else if (isConstantSize && hasOrgRect) {
          rect = orgRect;
        } else if (!element) {
          return;
        } else {
          rect = {
            left: element.offsetLeft,
            top: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
          };
        }

        if (!hasOrgRect) {
          item.orgRect = __assign({}, rect);
        }

        item.rect = __assign({}, rect);

        if (item.element) {
          item.mountState = MOUNT_STATE.MOUNTED;
        }

        if (item.updateState === UPDATE_STATE.NEED_UPDATE) {
          item.updateState = UPDATE_STATE.UPDATED;
        }

        item.attributes = element ? getDataAttributes(element, this.options.attributePrefix) : {};
        this.initialRect = __assign({}, rect);
        return rect;
      };

      __proto._renderItem = function (item) {
        var element = item.element;
        var cssRect = item.cssRect;

        if (!element || !cssRect) {
          return;
        }

        var _a = this.options,
            horizontal = _a.horizontal,
            useTransform = _a.useTransform;
        var posPercentage = this.posPercetage;
        var sizePercentage = this.sizePercetage;
        var cssTexts = ["position: absolute;"];
        var _b = RECT_NAMES[horizontal ? "horizontal" : "vertical"],
            sizeName = _b.inlineSize,
            posName = _b.inlinePos;
        var inlineSize = this.getInlineSize();
        var keys = getKeys(cssRect);

        if (useTransform) {
          keys = keys.filter(function (key) {
            return key !== "top" && key !== "left";
          });
          cssTexts.push("transform: " + ("translate(" + (cssRect.left || 0) + "px, " + (cssRect.top || 0) + "px);"));
        }

        cssTexts.push.apply(cssTexts, keys.map(function (name) {
          var value = cssRect[name];

          if (name === sizeName && sizePercentage || name === posName && posPercentage) {
            return name + ": " + value / inlineSize * 100 + "%;";
          }

          return name + ": " + value + "px;";
        }));
        element.style.cssText += cssTexts.join("");
      };

      return ItemRenderer;
    }();

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/list-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-list-differ
    version: 1.0.0
    */
    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var PolyMap =
    /*#__PURE__*/
    function () {
      function PolyMap() {
        this.keys = [];
        this.values = [];
      }

      var __proto = PolyMap.prototype;

      __proto.get = function (key) {
        return this.values[this.keys.indexOf(key)];
      };

      __proto.set = function (key, value) {
        var keys = this.keys;
        var values = this.values;
        var prevIndex = keys.indexOf(key);
        var index = prevIndex === -1 ? keys.length : prevIndex;
        keys[index] = key;
        values[index] = value;
      };

      return PolyMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var HashMap =
    /*#__PURE__*/
    function () {
      function HashMap() {
        this.object = {};
      }

      var __proto = HashMap.prototype;

      __proto.get = function (key) {
        return this.object[key];
      };

      __proto.set = function (key, value) {
        this.object[key] = value;
      };

      return HashMap;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var SUPPORT_MAP = typeof Map === "function";

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var Link =
    /*#__PURE__*/
    function () {
      function Link() {}

      var __proto = Link.prototype;

      __proto.connect = function (prevLink, nextLink) {
        this.prev = prevLink;
        this.next = nextLink;
        prevLink && (prevLink.next = this);
        nextLink && (nextLink.prev = this);
      };

      __proto.disconnect = function () {
        // In double linked list, diconnect the interconnected relationship.
        var prevLink = this.prev;
        var nextLink = this.next;
        prevLink && (prevLink.next = nextLink);
        nextLink && (nextLink.prev = prevLink);
      };

      __proto.getIndex = function () {
        var link = this;
        var index = -1;

        while (link) {
          link = link.prev;
          ++index;
        }

        return index;
      };

      return Link;
    }();

    /*
    egjs-list-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */

    function orderChanged(changed, fixed) {
      // It is roughly in the order of these examples.
      // 4, 6, 0, 2, 1, 3, 5, 7
      var fromLinks = []; // 0, 1, 2, 3, 4, 5, 6, 7

      var toLinks = [];
      changed.forEach(function (_a) {
        var from = _a[0],
            to = _a[1];
        var link = new Link();
        fromLinks[from] = link;
        toLinks[to] = link;
      }); // `fromLinks` are connected to each other by double linked list.

      fromLinks.forEach(function (link, i) {
        link.connect(fromLinks[i - 1]);
      });
      return changed.filter(function (_, i) {
        return !fixed[i];
      }).map(function (_a, i) {
        var from = _a[0],
            to = _a[1];

        if (from === to) {
          return [0, 0];
        }

        var fromLink = fromLinks[from];
        var toLink = toLinks[to - 1];
        var fromIndex = fromLink.getIndex(); // Disconnect the link connected to `fromLink`.

        fromLink.disconnect(); // Connect `fromLink` to the right of `toLink`.

        if (!toLink) {
          fromLink.connect(undefined, fromLinks[0]);
        } else {
          fromLink.connect(toLink, toLink.next);
        }

        var toIndex = fromLink.getIndex();
        return [fromIndex, toIndex];
      });
    }

    var Result =
    /*#__PURE__*/
    function () {
      function Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed) {
        this.prevList = prevList;
        this.list = list;
        this.added = added;
        this.removed = removed;
        this.changed = changed;
        this.maintained = maintained;
        this.changedBeforeAdded = changedBeforeAdded;
        this.fixed = fixed;
      }

      var __proto = Result.prototype;
      Object.defineProperty(__proto, "ordered", {
        get: function () {
          if (!this.cacheOrdered) {
            this.caculateOrdered();
          }

          return this.cacheOrdered;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "pureChanged", {
        get: function () {
          if (!this.cachePureChanged) {
            this.caculateOrdered();
          }

          return this.cachePureChanged;
        },
        enumerable: true,
        configurable: true
      });

      __proto.caculateOrdered = function () {
        var ordered = orderChanged(this.changedBeforeAdded, this.fixed);
        var changed = this.changed;
        var pureChanged = [];
        this.cacheOrdered = ordered.filter(function (_a, i) {
          var from = _a[0],
              to = _a[1];
          var _b = changed[i],
              fromBefore = _b[0],
              toBefore = _b[1];

          if (from !== to) {
            pureChanged.push([fromBefore, toBefore]);
            return true;
          }
        });
        this.cachePureChanged = pureChanged;
      };

      return Result;
    }();

    /**
     *
     * @memberof eg.ListDiffer
     * @static
     * @function
     * @param - Previous List <ko> 이전 목록 </ko>
     * @param - List to Update <ko> 업데이트 할 목록 </ko>
     * @param - This callback function returns the key of the item. <ko> 아이템의 키를 반환하는 콜백 함수입니다.</ko>
     * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
     * @example
     * import { diff } from "@egjs/list-differ";
     * // script => eg.ListDiffer.diff
     * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1], e => e);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */

    function diff(prevList, list, findKeyCallback) {
      var mapClass = SUPPORT_MAP ? Map : findKeyCallback ? HashMap : PolyMap;

      var callback = findKeyCallback || function (e) {
        return e;
      };

      var added = [];
      var removed = [];
      var maintained = [];
      var prevKeys = prevList.map(callback);
      var keys = list.map(callback);
      var prevKeyMap = new mapClass();
      var keyMap = new mapClass();
      var changedBeforeAdded = [];
      var fixed = [];
      var removedMap = {};
      var changed = [];
      var addedCount = 0;
      var removedCount = 0; // Add prevKeys and keys to the hashmap.

      prevKeys.forEach(function (key, prevListIndex) {
        prevKeyMap.set(key, prevListIndex);
      });
      keys.forEach(function (key, listIndex) {
        keyMap.set(key, listIndex);
      }); // Compare `prevKeys` and `keys` and add them to `removed` if they are not in `keys`.

      prevKeys.forEach(function (key, prevListIndex) {
        var listIndex = keyMap.get(key); // In prevList, but not in list, it is removed.

        if (typeof listIndex === "undefined") {
          ++removedCount;
          removed.push(prevListIndex);
        } else {
          removedMap[listIndex] = removedCount;
        }
      }); // Compare `prevKeys` and `keys` and add them to `added` if they are not in `prevKeys`.

      keys.forEach(function (key, listIndex) {
        var prevListIndex = prevKeyMap.get(key); // In list, but not in prevList, it is added.

        if (typeof prevListIndex === "undefined") {
          added.push(listIndex);
          ++addedCount;
        } else {
          maintained.push([prevListIndex, listIndex]);
          removedCount = removedMap[listIndex] || 0;
          changedBeforeAdded.push([prevListIndex - removedCount, listIndex - addedCount]);
          fixed.push(listIndex === prevListIndex);

          if (prevListIndex !== listIndex) {
            changed.push([prevListIndex, listIndex]);
          }
        }
      }); // Sort by ascending order of 'to(list's index).

      removed.reverse();
      return new Result(prevList, list, added, removed, changed, maintained, changedBeforeAdded, fixed);
    }

    /*
    Copyright (c) 2019-present NAVER Corp.
    name: @egjs/children-differ
    license: MIT
    author: NAVER Corp.
    repository: https://github.com/naver/egjs-children-differ
    version: 1.0.1
    */

    /*
    egjs-children-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    var findKeyCallback = typeof Map === "function" ? undefined : function () {
      var childrenCount = 0;
      return function (el) {
        return el.__DIFF_KEY__ || (el.__DIFF_KEY__ = ++childrenCount);
      };
    }();

    /*
    egjs-children-differ
    Copyright (c) 2019-present NAVER Corp.
    MIT license
    */
    /**
     *
     * @memberof eg.ChildrenDiffer
     * @static
     * @function
     * @param - Previous List <ko> 이전 목록 </ko>
     * @param - List to Update <ko> 업데이트 할 목록 </ko>
     * @return - Returns the diff between `prevList` and `list` <ko> `prevList`와 `list`의 다른 점을 반환한다.</ko>
     * @example
     * import { diff } from "@egjs/children-differ";
     * // script => eg.ChildrenDiffer.diff
     * const result = diff([0, 1, 2, 3, 4, 5], [7, 8, 0, 4, 3, 6, 2, 1]);
     * // List before update
     * // [1, 2, 3, 4, 5]
     * console.log(result.prevList);
     * // Updated list
     * // [4, 3, 6, 2, 1]
     * console.log(result.list);
     * // Index array of values added to `list`
     * // [0, 1, 5]
     * console.log(result.added);
     * // Index array of values removed in `prevList`
     * // [5]
     * console.log(result.removed);
     * // An array of index pairs of `prevList` and `list` with different indexes from `prevList` and `list`
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.changed);
     * // The subset of `changed` and an array of index pairs that moved data directly. Indicate an array of absolute index pairs of `ordered`.(Formatted by: Array<[index of prevList, index of list]>)
     * // [[4, 3], [3, 4], [2, 6]]
     * console.log(result.pureChanged);
     * // An array of index pairs to be `ordered` that can synchronize `list` before adding data. (Formatted by: Array<[prevIndex, nextIndex]>)
     * // [[4, 1], [4, 2], [4, 3]]
     * console.log(result.ordered);
     * // An array of index pairs of `prevList` and `list` that have not been added/removed so data is preserved
     * // [[0, 2], [4, 3], [3, 4], [2, 6], [1, 7]]
     * console.log(result.maintained);
     */

    function diff$1(prevList, list) {
      return diff(prevList, list, findKeyCallback);
    }

    /**
     * @memberof Grid
     * @implements Grid.GridItem.GridItemStatus
     */

    var GridItem =
    /*#__PURE__*/
    function () {
      /**
       * @constructor
       * @param horizontal - Direction of the scroll movement. (true: horizontal, false: vertical) <ko>스크롤 이동 방향. (true: 가로방향, false: 세로방향)</ko>
       * @param itemStatus - Default status object of GridItem module. <ko>GridItem 모듈의 기본 status 객체.</ko>
       */
      function GridItem(horizontal, itemStatus) {
        if (itemStatus === void 0) {
          itemStatus = {};
        }

        var _a;

        this.horizontal = horizontal;
        var element = itemStatus.element;

        var status = __assign({
          key: "",
          orgRect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          },
          rect: {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          },
          cssRect: {},
          attributes: {},
          data: {},
          mountState: MOUNT_STATE.UNCHECKED,
          updateState: UPDATE_STATE.NEED_UPDATE,
          element: element || null,
          orgCSSText: (_a = element === null || element === void 0 ? void 0 : element.style.cssText) !== null && _a !== void 0 ? _a : ""
        }, itemStatus);

        for (var name in status) {
          this[name] = status[name];
        }
      }

      var __proto = GridItem.prototype;
      Object.defineProperty(__proto, "orgInlineSize", {
        /**
         * The size in inline direction before first rendering. "width" if horizontal is false, "height" otherwise.
         * @ko 첫 렌더링 되기 전의 inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#orgInlineSize
         */
        get: function () {
          var orgRect = this.orgRect;
          return this.horizontal ? orgRect.height : orgRect.width;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "orgContentSize", {
        /**
         * The size in content direction before first rendering. "height" if horizontal is false, "width" otherwise.
         * @ko 첫 렌더링 되기 전의 content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#orgContentSize
         */
        get: function () {
          var orgRect = this.orgRect;
          return this.horizontal ? orgRect.width : orgRect.height;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "inlineSize", {
        /**
         * The size in inline direction. "width" if horizontal is false, "height" otherwise.
         * @ko inline 방향의 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#inlineSize
         */
        get: function () {
          var rect = this.rect;
          return this.horizontal ? rect.height : rect.width;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "contentSize", {
        /**
         * The size in content direction. "height" if horizontal is false, "width" otherwise.
         * @ko content 방향의 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#contentSize
         */
        get: function () {
          var rect = this.rect;
          return this.horizontal ? rect.width : rect.height;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssInlineSize", {
        /**
         * The CSS size in inline direction applied to the Grid. "width" if horizontal is false, "height" otherwise.
         * @ko Grid에 적용된 inline 방향의 CSS 사이즈. horizontal이 false면 "width", 아니면 "height".
         * @member Grid.GridItem#cssInlineSize
         */
        get: function () {
          var cssRect = this.cssRect;
          return this.horizontal ? cssRect.height : cssRect.width;
        },
        set: function (inlineSize) {
          var cssRect = this.cssRect;
          cssRect[this.horizontal ? "height" : "width"] = inlineSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssContentSize", {
        /**
         * The CSS size in content direction applied to the Grid. "height" if horizontal is false, "width" otherwise.
         * @ko Grid에 적용된 content 방향의 CSS 사이즈. horizontal이 false면 "height", 아니면 "width".
         * @member Grid.GridItem#cssContentSize
         */
        get: function () {
          var cssRect = this.cssRect;
          return this.horizontal ? cssRect.width : cssRect.height;
        },
        set: function (contentSize) {
          var cssRect = this.cssRect;
          cssRect[this.horizontal ? "width" : "height"] = contentSize;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssInlinePos", {
        /**
         * The CSS pos in inline direction applied to the Grid. "left" if horizontal is false, "top" otherwise.
         * @ko Grid에 적용된 inline 방향의 CSS 포지션. horizontal이 false면 "left", 아니면 "top".
         * @member Grid.GridItem#cssInlinePos
         */
        get: function () {
          var cssRect = this.cssRect;
          return this.horizontal ? cssRect.top : cssRect.left;
        },
        set: function (inlinePos) {
          var cssRect = this.cssRect;
          cssRect[this.horizontal ? "top" : "left"] = inlinePos;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(__proto, "cssContentPos", {
        /**
         * The CSS pos in content direction applied to the Grid. "top" if horizontal is false, "left" otherwise.
         * @ko Grid에 적용된 content 방향의 CSS 포지션. horizontal이 false면 "top", 아니면 "left".
         * @member Grid.GridItem#cssContentPos
         */
        get: function () {
          var cssRect = this.cssRect;
          return this.horizontal ? cssRect.left : cssRect.top;
        },
        set: function (contentPos) {
          var cssRect = this.cssRect;
          cssRect[this.horizontal ? "left" : "top"] = contentPos;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Set CSS Rect through GridRect.
       * @ko GridRect을 통해 CSS Rect를 설정한다.
       * @param - The style for setting CSS rect. <ko>CSS rect를 설정하기 위한 스타일.</ko>
       */

      __proto.setCSSGridRect = function (gridRect) {
        var names = RECT_NAMES[this.horizontal ? "horizontal" : "vertical"];
        var rect = {};

        for (var name in gridRect) {
          rect[names[name]] = gridRect[name];
        }

        this.cssRect = rect;
      };
      /**
       * Returns the status of the item.
       * @ko 아이템의 상태를 반환한다.
       */


      __proto.getStatus = function () {
        return {
          mountState: this.mountState,
          updateState: this.updateState,
          attributes: this.attributes,
          orgCSSText: this.orgCSSText,
          element: null,
          key: this.key,
          orgRect: this.orgRect,
          rect: this.rect,
          cssRect: this.cssRect,
          data: this.data
        };
      };

      return GridItem;
    }();

    /**
     * @extends eg.Component
     */

    var Grid =
    /*#__PURE__*/
    function (_super) {
      __extends(Grid, _super);
      /**
       * @param - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
       * @param - The option object of the Grid module <ko>Grid 모듈의 옵션 객체</ko>
       */


      function Grid(containerElement, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.items = [];
        _this.outlines = {
          start: [],
          end: []
        };
        _this._renderTimer = 0;
        _this._resizeTimer = 0;
        _this._maxResizeDebounceTimer = 0;

        _this._onResize = function () {
          clearTimeout(_this._resizeTimer);
          clearTimeout(_this._maxResizeDebounceTimer);
          _this._maxResizeDebounceTimer = 0;
          _this._resizeTimer = 0;

          _this.renderItems({
            useResize: true
          });
        };

        _this._scheduleResize = function () {
          var _a = _this.options,
              resizeDebounce = _a.resizeDebounce,
              maxResizeDebounce = _a.maxResizeDebounce;

          if (!_this._maxResizeDebounceTimer && maxResizeDebounce >= resizeDebounce) {
            _this._maxResizeDebounceTimer = window.setTimeout(_this._onResize, maxResizeDebounce);
          }

          if (_this._resizeTimer) {
            clearTimeout(_this._resizeTimer);
            _this._resizeTimer = 0;
          }

          _this._resizeTimer = window.setTimeout(_this._onResize, resizeDebounce);
        };

        _this.options = __assign(__assign({}, _this.constructor.defaultOptions), options);
        _this.containerElement = isString(containerElement) ? document.querySelector(containerElement) : containerElement;
        var _a = _this.options,
            isEqualSize = _a.isEqualSize,
            isConstantSize = _a.isConstantSize,
            useTransform = _a.useTransform,
            horizontal = _a.horizontal,
            percentage = _a.percentage; // TODO: 테스트용 설정

        _this.containerManager = new ContainerManager(_this.containerElement, {
          horizontal: horizontal
        });
        _this.itemRenderer = new ItemRenderer({
          useTransform: useTransform,
          isEqualSize: isEqualSize,
          isConstantSize: isConstantSize,
          percentage: percentage
        });

        _this._init();

        return _this;
      }

      var __proto = Grid.prototype;
      Grid_1 = Grid;
      /**
       * Return items.
       * @ko 아이템들을 반환한다.
       */

      __proto.getItems = function () {
        return this.items;
      };
      /**
       * Returns the children of the container element.
       * @ko 컨테이너 엘리먼트의 children을 반환한다.
       */


      __proto.getChildren = function () {
        return [].slice.call(this.containerElement.children);
      };
      /**
       * Set items.
       * @ko 아이템들을 설정한다.
       * @param items - The items to set. <ko>설정할 아이템들</ko>
       */


      __proto.setItems = function (items) {
        this.items = items;
        return this;
      };
      /**
       * Gets the container's inline size. ("width" if horizontal is false, otherwise "height")
       * @ko container의 inline 사이즈를 가져온다. (horizontal이 false면 "width", 아니면 "height")
       */


      __proto.getContainerInlineSize = function () {
        return this.containerManager.getInlineSize();
      };
      /**
       * Returns the outlines of the start and end of the Grid.
       * @ko Grid의 처음과 끝의 outline을 반환한다.
       */


      __proto.getOutlines = function () {
        return this.outlines;
      };
      /**
       * Set outlines.
       * @ko 아웃라인을 설정한다.
       * @param items - The outlines to set. <ko>설정할 아웃라인.</ko>
       */


      __proto.setOutlines = function (outlines) {
        this.outlines = outlines;
        return this;
      };
      /**
       * When elements change, it synchronizes and renders items.
       * @ko elements가 바뀐 경우 동기화를 하고 렌더링을 한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.syncElements = function (options) {
        if (options === void 0) {
          options = {};
        }

        var items = this.items;
        var horizontal = this.options.horizontal;
        var elements = this.getChildren();

        var _a = diff$1(this.items.map(function (item) {
          return item.element;
        }), elements),
            added = _a.added,
            maintained = _a.maintained,
            changed = _a.changed,
            removed = _a.removed;

        var nextItems = [];
        maintained.forEach(function (_a) {
          var beforeIndex = _a[0],
              afterIndex = _a[1];
          nextItems[afterIndex] = items[beforeIndex];
        });
        added.forEach(function (index) {
          nextItems[index] = new GridItem(horizontal, {
            element: elements[index]
          });
        });
        this.setItems(nextItems);

        if (added.length || removed.length || changed.length) {
          this.renderItems(options);
        }

        return this;
      };
      /**
       * Update the size of the items and render them.
       * @ko 아이템들의 사이즈를 업데이트하고 렌더링을 한다.
       * @param - Items to be updated. <ko>업데이트할 아이템들.</ko>
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.updateItems = function (items, options) {
        if (items === void 0) {
          items = this.items;
        }

        if (options === void 0) {
          options = {};
        }

        items.forEach(function (item) {
          item.updateState = UPDATE_STATE.NEED_UPDATE;
        });
        this.checkReady(options);
        return this;
      };
      /**
       * Rearrange items to fit the grid and render them.
       * @ko grid에 맞게 아이템을 재배치하고 렌더링을 한다.
       * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
       */


      __proto.renderItems = function (options) {
        if (options === void 0) {
          options = {};
        }

        this._clearRenderTimer();

        if (!this.getItems().length && this.getChildren().length) {
          this.syncElements(options);
        } else if (options.useResize) {
          // Resize container and Update all items
          this._resizeContainer();

          this.updateItems(this.items, options);
        } else {
          // Update only items that need to be updated.
          this.checkReady(options);
        }

        return this;
      };
      /**
       * Returns current status such as item's position, size. The returned status can be restored with the setStatus() method.
       * @ko 아이템의 위치, 사이즈 등 현재 상태를 반환한다. 반환한 상태는 setStatus() 메서드로 복원할 수 있다.
       */


      __proto.getStatus = function () {
        return {
          outlines: this.outlines,
          items: this.items.map(function (item) {
            return item.getStatus();
          }),
          containerManager: this.containerManager.getStatus(),
          itemRenderer: this.itemRenderer.getStatus()
        };
      };
      /**
       * Set status of the Grid module with the status returned through a call to the getStatus() method.
       * @ko getStatus() 메서드에 대한 호출을 통해 반환된 상태로 Grid 모듈의 상태를 설정한다.
       */


      __proto.setStatus = function (status) {
        var _this = this;

        var horizontal = this.options.horizontal;
        var containerManager = this.containerManager;
        var prevInlineSize = containerManager.getInlineSize();
        var children = this.getChildren();
        this.itemRenderer.setStatus(status.itemRenderer);
        containerManager.setStatus(status.containerManager);
        this.outlines = status.outlines;
        this.items = status.items.map(function (item, i) {
          return new GridItem(horizontal, __assign(__assign({}, item), {
            element: children[i]
          }));
        });
        this.itemRenderer.renderItems(this.items);

        if (prevInlineSize !== containerManager.getInlineSize()) {
          this.renderItems({
            useResize: true
          });
        } else {
          window.setTimeout(function () {
            _this._renderComplete({
              mounted: _this.items,
              updated: [],
              isResize: false
            });
          });
        }

        return this;
      };
      /**
       * Releases the instnace and events and returns the CSS of the container and elements.
       * @ko 인스턴스와 이벤트를 해제하고 컨테이너와 엘리먼트들의 CSS를 되돌린다.
       * @param Options for destroy. <ko>destory()를 위한 옵션</ko>
       */


      __proto.destroy = function (options) {
        var _a;

        if (options === void 0) {
          options = {};
        }

        this.containerManager.destroy(options);

        if (!options.preserveUI) {
          this.items.forEach(function (_a) {
            var element = _a.element,
                orgCSSText = _a.orgCSSText;

            if (element) {
              element.style.cssText = orgCSSText;
            }
          });
        }

        window.removeEventListener("resize", this._scheduleResize);
        (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
      };

      __proto.checkReady = function (options) {
        var _this = this;

        var _a;

        if (options === void 0) {
          options = {};
        } // Grid: renderItems => checkItems => _renderItems


        var items = this.items;
        var updated = items.filter(function (item) {
          return item.element && item.updateState !== UPDATE_STATE.UPDATED;
        });
        var mounted = updated.filter(function (item) {
          return item.mountState !== MOUNT_STATE.MOUNTED;
        });
        var moreUpdated = [];
        (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
        this._im = new ImReady({
          prefix: this.options.attributePrefix
        }).on("preReadyElement", function (e) {
          if (e.hasLoading) {
            updated[e.index].updateState = UPDATE_STATE.WAIT_LOADING;
          }
        }).on("preReady", function () {
          _this.itemRenderer.updateItems(updated);

          _this._renderItems(mounted, updated, options);
        }).on("readyElement", function (e) {
          var item = updated[e.index];

          if (e.hasLoading) {
            item.updateState = UPDATE_STATE.NEED_UPDATE;

            if (e.isPreReadyOver) {
              _this.itemRenderer.updateItems([item]);

              _this._renderItems([], [item], options);
            }
          }
        }).on("error", function (e) {
          var item = items[e.index];
          /**
           * This event is fired when an error occurs in the content.
           * @ko 콘텐츠 로드에 에러가 날 때 발생하는 이벤트.
           * @event Grid#contentError
           * @param {Grid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
           * @param {HTMLElement} [e.element] - The item's element.<ko>아이템의 엘리먼트.</ko>
           * @param {HTMLElement} [e.target] - The content element with error.<ko>에러난 발생한 콘텐츠 엘리먼트.</ko>
           * @param {Grid.GridItem} [e.item] - The item with error content.<ko>에러난 콘텐츠를 가지고 있는 아이템</ko>
           * @param {function} [e.update] - If you have fixed the error and want to recheck it, call update(). If you remove an element, call the syncElements() method.<ko>에러를 해결했고 재검사하고 싶으면 update()를 호출해라. 만약 엘리먼트를 삭제한 경우 syncElements() 메서드를 호출해라.</ko>
           * @example
          grid.on("contentError", e => {
          e.update();
          });
          */

          _this.trigger("contentError", {
            element: e.element,
            target: e.target,
            item: item,
            update: function () {
              moreUpdated.push(item);
            }
          });
        }).on("ready", function () {
          if (moreUpdated.length) {
            _this.updateItems(moreUpdated);
          }
        }).check(updated.map(function (item) {
          return item.element;
        }));
      };

      __proto.scheduleRender = function () {
        var _this = this;

        this._clearRenderTimer();

        this._renderTimer = window.setTimeout(function () {
          _this.renderItems();
        });
      };

      __proto._fit = function () {
        var outlines = this.outlines;
        var startOutline = outlines.start;
        var endOutline = outlines.end;
        var outlineOffset = startOutline.length ? Math.min.apply(Math, startOutline) : 0;
        outlines.start = startOutline.map(function (point) {
          return point - outlineOffset;
        });
        outlines.end = endOutline.map(function (point) {
          return point - outlineOffset;
        });
        this.items.forEach(function (item) {
          var contentPos = item.cssContentPos;

          if (!isNumber(contentPos)) {
            return;
          }

          item.cssContentPos = contentPos - outlineOffset;
        });
      };

      __proto._renderItems = function (mounted, updated, options) {
        var prevOutlines = this.outlines;
        var direction = options.direction || this.options.defaultDirection;
        var prevOutline = options.outline || prevOutlines[direction === "end" ? "start" : "end"];
        var items = this.items;
        var nextOutlines = {
          start: __spreadArrays(prevOutline),
          end: __spreadArrays(prevOutline)
        };

        if (items.length) {
          nextOutlines = this.applyGrid(this.items, direction, prevOutline);
        }

        this.setOutlines(nextOutlines);

        this._fit();

        this.itemRenderer.renderItems(this.items);

        this._refreshContainerContentSize();

        this._renderComplete({
          mounted: mounted,
          updated: updated,
          isResize: !!options.useResize
        });
      };

      __proto._renderComplete = function (e) {
        /**
         * This event is fired when the Grid has completed rendering.
         * @ko Grid가 렌더링이 완료됐을 때  발생하는 이벤트이다.
         * @event Grid#renderComplete
         * @param {Grid.OnRenderComplete} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {function} [e.mounted] - The items rendered for the first time <ko>처음 렌더링한 아이템들</ko>
         * @param {function} [e.updated] - The items updated in size.<ko>사이즈 업데이트한 아이템들.</ko>
         * @param {function} [e.useResize] - Whether rendering was done using the resize event or the useResize option. <ko>resize 이벤트 또는 useResize 옵션을 사용하여 렌더링를 했는지 여부.</ko>
         * @example
        grid.on("renderComplete", e => {
        console.log(e.mounted, e.updated, e.useResize);
        });
          */
        this.trigger("renderComplete", e);
      };

      __proto._clearRenderTimer = function () {
        clearTimeout(this._renderTimer);
        this._renderTimer = 0;
      };

      __proto._refreshContainerContentSize = function () {
        var _a = this.outlines,
            startOutline = _a.start,
            endOutline = _a.end;
        var gap = this.options.gap;
        var endPoint = endOutline.length ? Math.max.apply(Math, endOutline) : 0;
        var startPoint = startOutline.length ? Math.max.apply(Math, startOutline) : 0;
        var contentSize = Math.max(startPoint, endPoint - gap);
        this.containerManager.setContentSize(contentSize);
      };

      __proto._resizeContainer = function () {
        this.containerManager.resize();
        this.itemRenderer.setContainerRect(this.containerManager.getRect());
      };

      __proto._init = function () {
        this._resizeContainer();

        if (this.options.autoResize) {
          window.addEventListener("resize", this._scheduleResize);
        }
      };

      var Grid_1;
      Grid.defaultOptions = DEFAULT_GRID_OPTIONS;
      Grid.propertyTypes = GRID_PROPERTY_TYPES;
      Grid = Grid_1 = __decorate([GetterSetter], Grid);
      return Grid;
    }(Component);
    /**
     * Gap used to create space around items.
     * @ko 아이템들 사이의 공간.
     * @name Grid#gap
     * @type {$ts:Grid.GridOptions["gap"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   gap: 0,
     * });
     *
     * grid.gap = 5;
     */

    /**
     * The default direction value when direction is not set in the render option.
     * @ko render옵션에서 direction을 미설정시의 기본 방향값.
     * @name Grid#defaultDirection
     * @type {$ts:Grid.GridOptions["defaultDirection"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   defaultDirection: "end",
     * });
     *
     * grid.defaultDirection = "start";
     */

    /**
     * The MasonryGrid is a layout that stacks cards with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new card.
     *
     * @ko MasonryGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 카드를 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 카드 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
     * @memberof Grid
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {Grid.MasonryGrid.MasonryGridOptions} options - The option object of the MasonryGrid module <ko>MasonryGrid 모듈의 옵션 객체</ko>
     */

    var MasonryGrid =
    /*#__PURE__*/
    function (_super) {
      __extends(MasonryGrid, _super);

      function MasonryGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;

        _this._columnSize = 0;
        _this._column = 1;
        return _this;
      }

      var __proto = MasonryGrid.prototype;

      __proto.applyGrid = function (items, direction, outline) {
        this._calculateColumnSize(items);

        this._calculateColumn(items);

        var column = this._column;
        var columnSize = this._columnSize;
        var _a = this.options,
            gap = _a.gap,
            align = _a.align,
            columnSizeRatio = _a.columnSizeRatio;
        var outlineLength = outline.length;
        var itemsLength = items.length;

        var alignPoses = this._getAlignPoses();

        var isEndDirection = direction === "end";
        var pointCalculateName = isEndDirection ? "min" : "max";
        var indexCalculateName = isEndDirection ? "indexOf" : "lastIndexOf";
        var startOutline = [0];

        if (outlineLength === column) {
          startOutline = outline.slice();
        } else {
          var point_1 = outlineLength ? Math[pointCalculateName].apply(Math, outline) : 0;
          startOutline = range(column).map(function () {
            return point_1;
          });
        }

        var endOutline = startOutline.slice();
        var columnDist = column > 1 ? alignPoses[1] - alignPoses[0] : 0;
        var isStretch = align === "stretch";

        var _loop_1 = function (i) {
          var point = Math[pointCalculateName].apply(Math, endOutline) || 0;
          var columnIndex = endOutline[indexCalculateName](point);
          var item = items[isEndDirection ? i : itemsLength - 1 - i];
          var columnAttribute = parseInt(item.attributes.column || "1", 10);
          var inlineSize = item.inlineSize;
          var contentSize = item.contentSize;
          var maxColumn = Math.min(column, parseInt(item.attributes.maxColumn || "1", 10));
          var itemColumn = Math.min(column, columnAttribute || Math.max(1, Math.ceil((inlineSize + gap) / columnDist)));

          if (columnIndex === -1) {
            columnIndex = 0;
          }

          if (column > 1 && itemColumn > 1) {
            if (isEndDirection) {
              // 0   columnIndex(+itemColumn)  column
              columnIndex = Math.min(columnIndex, Math.max(0, column - itemColumn));
            } else {
              // 0   columnIndex(-itemColumn)  column
              columnIndex = Math.max(columnIndex, Math.min(column - 1, itemColumn));
            }
          }

          if (columnAttribute > 0) {
            var endColumnIndex = columnIndex + (isEndDirection ? itemColumn : -itemColumn);
            var columnOutline = outline.slice(Math.min(columnIndex, endColumnIndex), Math.max(columnIndex, endColumnIndex));
            var columnPoint = isEndDirection ? Math.max.apply(Math, columnOutline) : Math.min.apply(Math, columnOutline);

            while (itemColumn < maxColumn) {
              var nextEndColumnIndex = columnIndex + (isEndDirection ? itemColumn + 1 : -itemColumn - 1);

              if (nextEndColumnIndex < 0 || nextEndColumnIndex > column) {
                break;
              }

              if (isEndDirection && outline[nextEndColumnIndex - 1] > columnPoint || !isEndDirection && outline[nextEndColumnIndex] < columnPoint) {
                break;
              }

              ++itemColumn;
            }

            if (itemColumn > 1 || isStretch) {
              inlineSize = (itemColumn - 1) * columnDist + columnSize;
              item.cssInlineSize = inlineSize;
            }

            if (columnSizeRatio > 0) {
              contentSize = inlineSize / columnSizeRatio;
              item.cssContentSize = contentSize;
            }
          }

          var inlinePos = alignPoses[columnIndex];
          var contentPos = isEndDirection ? point : point - gap - contentSize;
          var endContentPos = contentPos + contentSize + gap;
          item.cssInlinePos = inlinePos;
          item.cssContentPos = contentPos;
          var endPoint = isEndDirection ? endContentPos : contentPos;
          range(itemColumn).forEach(function (indexOffset) {
            endOutline[columnIndex + (isEndDirection ? indexOffset : -indexOffset)] = endPoint;
          });
        };

        for (var i = 0; i < itemsLength; ++i) {
          _loop_1(i);
        } // if end items, startOutline is low, endOutline is high
        // if start items, startOutline is high, endOutline is low


        return {
          start: isEndDirection ? startOutline : endOutline,
          end: isEndDirection ? endOutline : startOutline
        };
      };

      __proto._calculateColumnSize = function (items) {
        var _a = this.options,
            columnSizeOption = _a.columnSize,
            gap = _a.gap,
            align = _a.align;

        if (align === "stretch") {
          var column = this.column;

          if (columnSizeOption) {
            column = Math.max(1, Math.floor((this.getContainerInlineSize() + gap) / (columnSizeOption + gap)));
          }

          this._columnSize = (this.getContainerInlineSize() + gap) / (column || 1) - gap;
        } else if (columnSizeOption) {
          this._columnSize = columnSizeOption;
        } else {
          for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var attributes = item.attributes;

            if (item.updateState !== UPDATE_STATE.UPDATED || !item.rect || attributes.column || attributes.maxColumn) {
              continue;
            }

            var inlineSize = item.inlineSize;
            this._columnSize = inlineSize;
            return inlineSize;
          }

          this._columnSize = this._columnSize || 0;
        }

        return this._columnSize;
      };

      __proto._calculateColumn = function (items) {
        var _a = this.options,
            gap = _a.gap,
            columnOption = _a.column;
        var columnSize = this._columnSize;
        var column = 1;

        if (columnOption) {
          column = columnOption;
        } else if (!columnSize) {
          column = 1;
        } else {
          column = Math.min(items.length, Math.max(1, Math.floor((this.getContainerInlineSize() + gap) / (columnSize + gap))));
        }

        this._column = column;
        return column;
      };

      __proto._getAlignPoses = function () {
        var columnSize = this._columnSize;
        var column = this._column;
        var _a = this.options,
            align = _a.align,
            gap = _a.gap;
        var containerSize = this.getContainerInlineSize();
        var indexes = range(column);
        var offset = 0;
        var dist = 0;

        if (align === "justify" || align === "stretch") {
          var countDist = column - 1;
          dist = countDist ? Math.max((containerSize - columnSize) / countDist, columnSize + gap) : 0;
          offset = Math.min(0, containerSize / 2 - (countDist * dist + columnSize) / 2);
        } else {
          dist = columnSize + gap;
          var totalColumnSize = (column - 1) * dist + columnSize;

          if (align === "center") {
            offset = (containerSize - totalColumnSize) / 2;
          } else if (align === "end") {
            offset = containerSize - totalColumnSize;
          }
        }

        return indexes.map(function (i) {
          return offset + i * dist;
        });
      };

      MasonryGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
        column: PROPERTY_TYPE.RENDER_PROPERTY,
        columnSize: PROPERTY_TYPE.RENDER_PROPERTY,
        columnSizeRatio: PROPERTY_TYPE.RENDER_PROPERTY,
        align: PROPERTY_TYPE.RENDER_PROPERTY
      });
      MasonryGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
        align: "justify",
        column: 0,
        columnSize: 0,
        columnSizeRatio: 0
      });
      MasonryGrid = __decorate([GetterSetter], MasonryGrid);
      return MasonryGrid;
    }(Grid);
    /**
     * Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify")
     * @ko 아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")
     * @name Grid.MasonryGrid#align
     * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["align"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   align: "start",
     * });
     *
     * grid.align = "justify";
     */

    /**
     * The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container.
     * @ko 열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0)
     * @name Grid.MasonryGrid#column
     * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["column"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   column: 0,
     * });
     *
     * grid.column = 4;
     */

    /**
     * The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0)
     * @ko 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0)
     * @name Grid.MasonryGrid#columnSize
     * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSize"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   columnSize: 0,
     * });
     *
     * grid.columnSize = 200;
     */

    /**
     * The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0)
     * @ko 열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다.
     * @name Grid.MasonryGrid#columnSizeRatio
     * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSizeRatio"]}
     * @example
     * import { MasonryGrid } from "@egjs/grid";
     *
     * const grid = new MasonryGrid(container, {
     *   columnSizeRatio: 0,
     * });
     *
     * grid.columnSizeRatio = 0.5;
     */

    /* eslint-disable */

    /******************************************************************************
     * Created 2008-08-19.
     *
     * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
     *
     * Copyright (C) 2008
     *   Wyatt Baldwin <self@wyattbaldwin.com>
     *   All rights reserved
     *
     * Licensed under the MIT license.
     *
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     *****************************************************************************/
    function single_source_shortest_paths(graph, s, d) {
      // Predecessor map for each node that has been encountered.
      // node ID => predecessor node ID
      var predecessors = {}; // Costs of shortest paths from s to all nodes encountered.
      // node ID => cost

      var costs = {};
      costs[s] = 0; // Costs of shortest paths from s to all nodes encountered; differs from
      // `costs` in that it provides easy access to the node that currently has
      // the known shortest path from s.
      // XXX: Do we actually need both `costs` and `open`?

      var open = new BinaryHeap(function (x) {
        return x.cost;
      });
      open.push({
        value: s,
        cost: 0
      });
      var closest;
      var u;
      var cost_of_s_to_u;
      var adjacent_nodes;
      var cost_of_e;
      var cost_of_s_to_u_plus_cost_of_e;
      var cost_of_s_to_v;
      var first_visit;

      while (open.size()) {
        // In the nodes remaining in graph that have a known cost from s,
        // find the node, u, that currently has the shortest path from s.
        closest = open.pop();
        u = closest.value;
        cost_of_s_to_u = closest.cost; // Get nodes adjacent to u...

        adjacent_nodes = graph(u) || {}; // ...and explore the edges that connect u to those nodes, updating
        // the cost of the shortest paths to any or all of those nodes as
        // necessary. v is the node across the current edge from u.

        for (var v in adjacent_nodes) {
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v]; // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.

          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e; // If we haven't visited v yet OR if the current known cost from s to
          // v is greater than the new cost we just found (cost of s to u plus
          // cost of u to v across e), update v's cost in the cost list and
          // update v's predecessor in the predecessor list (it's now u).

          cost_of_s_to_v = costs[v];
          first_visit = typeof costs[v] === "undefined";

          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = cost_of_s_to_u_plus_cost_of_e;
            open.push({
              value: v,
              cost: cost_of_s_to_u_plus_cost_of_e
            });
            predecessors[v] = u;
          }
        }
      }

      if (typeof costs[d] === "undefined") {
        var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
        throw new Error(msg);
      }

      return predecessors;
    }

    function extract_shortest_path_from_predecessor_list(predecessors, d) {
      var nodes = [];
      var u = d;

      while (u) {
        nodes.push(u);
        u = predecessors[u];
      }

      nodes.reverse();
      return nodes;
    }

    function find_path(graph, s, d) {
      var predecessors = single_source_shortest_paths(graph, s, d);
      return extract_shortest_path_from_predecessor_list(predecessors, d);
    }

    var BinaryHeap =
    /*#__PURE__*/
    function () {
      function BinaryHeap(scoreFunction) {
        this.content = [];
        this.scoreFunction = scoreFunction;
      }

      var __proto = BinaryHeap.prototype;

      __proto.push = function (element) {
        // Add the new element to the end of the array.
        this.content.push(element); // Allow it to bubble up.

        this.bubbleUp(this.content.length - 1);
      };

      __proto.pop = function () {
        // Store the first element so we can return it later.
        var result = this.content[0]; // Get the element at the end of the array.

        var end = this.content.pop(); // If there are any elements left, put the end element at the
        // start, and let it sink down.

        if (this.content.length > 0) {
          this.content[0] = end;
          this.sinkDown(0);
        }

        return result;
      };

      __proto.size = function () {
        return this.content.length;
      };

      __proto.bubbleUp = function (_n) {
        var n = _n; // Fetch the element that has to be moved.

        var element = this.content[n]; // When at 0, an element can not go up any further.

        while (n > 0) {
          // Compute the parent element's index, and fetch it.
          var parentN = Math.floor((n + 1) / 2) - 1;
          var parent = this.content[parentN]; // Swap the elements if the parent is greater.

          if (this.scoreFunction(element) < this.scoreFunction(parent)) {
            this.content[parentN] = element;
            this.content[n] = parent; // Update 'n' to continue at the new position.

            n = parentN;
          } else {
            // Found a parent that is less, no need to move it further.
            break;
          }
        }
      };

      __proto.sinkDown = function (n) {
        // Look up the target element and its score.
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);
        var child1Score;

        while (true) {
          // Compute the indices of the child elements.
          var child2N = (n + 1) * 2;
          var child1N = child2N - 1; // This is used to store the new position of the element,
          // if any.

          var swap = null; // If the first child exists (is inside the array)...

          if (child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N];
            child1Score = this.scoreFunction(child1); // If the score is less than our element's, we need to swap.

            if (child1Score < elemScore) {
              swap = child1N;
            }
          } // Do the same checks for the other child.


          if (child2N < length) {
            var child2 = this.content[child2N];
            var child2Score = this.scoreFunction(child2);

            if (child2Score < (swap == null ? elemScore : child1Score)) {
              swap = child2N;
            }
          } // If the element needs to be moved, swap it, and continue.


          if (swap !== null) {
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
          } else {
            // Otherwise, we are done.
            break;
          }
        }
      };

      return BinaryHeap;
    }();

    /**
     * 'justified' is a printing term with the meaning that 'it fits in one row wide'. JustifiedGrid is a grid that the card is filled up on the basis of a line given a size.
     * @ko 'justified'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. JustifiedGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 카드가 가득 차도록 배치하는 Grid다.
     * @memberof Grid
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {Grid.JustifiedGrid.JustifiedGridOptions} options - The option object of the JustifiedGrid module <ko>JustifiedGrid 모듈의 옵션 객체</ko>
     */

    var JustifiedGrid =
    /*#__PURE__*/
    function (_super) {
      __extends(JustifiedGrid, _super);

      function JustifiedGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = JustifiedGrid.prototype;

      __proto.applyGrid = function (items, direction, outline) {
        var rowRange = this.options.rowRange;
        var path = [];

        if (items.length) {
          path = rowRange ? this._getRowPath(items) : this._getPath(items);
        }

        return this._setStyle(items, path, outline, direction === "end");
      };

      __proto._getRowPath = function (items) {
        var _a;

        var _b = this.options,
            columnRangeOption = _b.columnRange,
            rowRangeOption = _b.rowRange;
        var columnRange = isObject(columnRangeOption) ? columnRangeOption : [columnRangeOption, columnRangeOption];
        var rowRange = isObject(rowRangeOption) ? rowRangeOption : [rowRangeOption, rowRangeOption];

        var pathLink = this._getRowLink(items, {
          path: [0],
          cost: 0,
          length: 0,
          currentNode: 0
        }, columnRange, rowRange);

        return (_a = pathLink === null || pathLink === void 0 ? void 0 : pathLink.path.map(function (node) {
          return "" + node;
        })) !== null && _a !== void 0 ? _a : [];
      };

      __proto._getRowLink = function (items, currentLink, columnRange, rowRange) {
        var minColumn = columnRange[0];
        var minRow = rowRange[0],
            maxRow = rowRange[1];
        var lastNode = items.length;
        var path = currentLink.path,
            pathLength = currentLink.length,
            cost = currentLink.cost,
            currentNode = currentLink.currentNode; // not reached lastNode but path is exceed or the number of remaining nodes is less than minColumn.

        if (currentNode < lastNode && (maxRow <= pathLength || currentNode + minColumn > lastNode)) {
          var rangeCost = getRangeCost(lastNode - currentNode, columnRange);
          var lastCost = rangeCost * Math.abs(this._getCost(items, currentNode, lastNode));
          return __assign(__assign({}, currentLink), {
            length: pathLength + 1,
            path: __spreadArrays(path, [lastNode]),
            currentNode: lastNode,
            cost: cost + lastCost,
            isOver: true
          });
        } else if (currentNode >= lastNode) {
          return __assign(__assign({}, currentLink), {
            currentNode: lastNode,
            isOver: minRow > pathLength || maxRow < pathLength
          });
        } else {
          return this._searchRowLink(items, currentLink, lastNode, columnRange, rowRange);
        }
      };

      __proto._searchRowLink = function (items, currentLink, lastNode, columnRange, rowRange) {
        var minColumn = columnRange[0],
            maxColumn = columnRange[1];
        var currentNode = currentLink.currentNode,
            path = currentLink.path,
            pathLength = currentLink.length,
            cost = currentLink.cost;
        var length = Math.min(lastNode, currentNode + maxColumn);
        var links = [];

        for (var nextNode = currentNode + minColumn; nextNode <= length; ++nextNode) {
          if (nextNode === currentNode) {
            continue;
          }

          var nextCost = Math.abs(this._getCost(items, currentNode, nextNode));

          var nextLink = this._getRowLink(items, {
            path: __spreadArrays(path, [nextNode]),
            length: pathLength + 1,
            cost: cost + nextCost,
            currentNode: nextNode
          }, columnRange, rowRange);

          if (nextLink) {
            links.push(nextLink);
          }
        }

        links.sort(function (a, b) {
          var aIsOver = a.isOver;
          var bIsOver = b.isOver;

          if (aIsOver !== bIsOver) {
            // If it is over, the cost is high.
            return aIsOver ? 1 : -1;
          }

          var aRangeCost = getRangeCost(a.length, rowRange);
          var bRangeCost = getRangeCost(b.length, rowRange);
          return aRangeCost - bRangeCost || a.cost - b.cost;
        }); // It returns the lowest cost link.

        return links[0];
      };

      __proto._getSize = function (items) {
        var gap = this.options.gap;
        var size = items.reduce(function (sum, item) {
          var inlineSize = item.orgInlineSize;
          var contentSize = item.orgContentSize;

          if (!inlineSize || !contentSize) {
            return sum;
          }

          return sum + inlineSize / contentSize;
        }, 0);
        return size ? (this.getContainerInlineSize() - gap * (items.length - 1)) / size : 0;
      };

      __proto._getCost = function (items, i, j) {
        var size = this._getSize(items.slice(i, j));

        var _a = this.options.sizeRange,
            minSize = _a[0],
            maxSize = _a[1];

        if (isFinite(maxSize)) {
          // if this size is not in range, the cost increases sharply.
          if (size < minSize) {
            return Math.pow(size - minSize, 2) + Math.pow(maxSize, 2);
          } else if (size > maxSize) {
            return Math.pow(size - maxSize, 2) + Math.pow(maxSize, 2);
          }
        } else if (size < minSize) {
          return Math.max(Math.pow(minSize, 2), Math.pow(size, 2)) + Math.pow(maxSize, 2);
        } // if this size in range, the cost is row


        return size - minSize;
      };

      __proto._getPath = function (items) {
        var _this = this;

        var lastNode = items.length;
        var columnRangeOption = this.options.columnRange;

        var _a = isObject(columnRangeOption) ? columnRangeOption : [columnRangeOption, columnRangeOption],
            minColumn = _a[0],
            maxColumn = _a[1];

        var graph = function (nodeKey) {
          var results = {};
          var currentNode = parseInt(nodeKey, 10);

          for (var nextNode = Math.min(currentNode + minColumn, lastNode); nextNode <= lastNode; ++nextNode) {
            if (nextNode - currentNode > maxColumn) {
              break;
            }

            var cost = _this._getCost(items, currentNode, nextNode);

            if (cost < 0 && nextNode === lastNode) {
              cost = 0;
            }

            results["" + nextNode] = Math.pow(cost, 2);
          }

          return results;
        }; // shortest path for items' total height.


        return find_path(graph, "0", "" + lastNode);
      };

      __proto._setStyle = function (items, path, outline, isEndDirection) {
        if (outline === void 0) {
          outline = [];
        }

        var gap = this.options.gap;
        var length = path.length;
        var startPoint = outline[0] || 0;
        var contentPos = startPoint;

        for (var i = 0; i < length - 1; ++i) {
          var path1 = parseInt(path[i], 10);
          var path2 = parseInt(path[i + 1], 10); // pathItems(path1 to path2) are in 1 line.

          var pathItems = items.slice(path1, path2);
          var pathItemsLength = pathItems.length;

          var contentSize = this._getSize(pathItems);

          for (var j = 0; j < pathItemsLength; ++j) {
            var item = pathItems[j];
            var inlineSize = item.orgInlineSize / item.orgContentSize * contentSize;
            var prevItem = pathItems[j - 1];
            var inlinePos = prevItem ? prevItem.cssInlinePos + prevItem.cssInlineSize + gap : 0;
            item.setCSSGridRect({
              inlinePos: inlinePos,
              contentPos: contentPos,
              inlineSize: inlineSize,
              contentSize: contentSize
            });
          }

          contentPos += gap + contentSize;
        }

        if (isEndDirection) {
          // previous group's end outline is current group's start outline
          return {
            start: [startPoint],
            end: [contentPos]
          };
        } // always start is lower than end.
        // contentPos is endPoinnt


        var height = contentPos - startPoint;
        items.forEach(function (item) {
          item.cssContentPos -= height;
        });
        return {
          start: [startPoint - height],
          end: [startPoint]
        };
      };

      JustifiedGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
        columnRange: PROPERTY_TYPE.RENDER_PROPERTY,
        rowRange: PROPERTY_TYPE.RENDER_PROPERTY,
        sizeRange: PROPERTY_TYPE.RENDER_PROPERTY
      });
      JustifiedGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
        columnRange: [1, 8],
        rowRange: 0,
        sizeRange: [0, Infinity]
      });
      JustifiedGrid = __decorate([GetterSetter], JustifiedGrid);
      return JustifiedGrid;
    }(Grid);
    /**
     * The minimum and maximum number of items per line. (default: [1, 8])
     * @ko 한 줄에 들어가는 아이템의 최소, 최대 개수. (default: [1, 8])
     * @name Grid.JustifiedGrid#columnRange
     * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["columnRange"]}
     * @example
     * import { JustifiedGrid } from "@egjs/grid";
     *
     * const grid = new JustifiedGrid(container, {
     *   columnRange: [1, 8],
     * });
     *
     * grid.columnRange = [3, 6];
     */

    /**
     * The minimum and maximum number of rows in a group, 0 is not set. (default: 0)
     * @ko 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다. (default: 0)
     * @name Grid.JustifiedGrid#rowRange
     * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["rowRange"]}
     * @example
     * import { JustifiedGrid } from "@egjs/grid";
     *
     * const grid = new JustifiedGrid(container, {
     *   rowRange: 0,
     * });
     *
     * grid.rowRange = [3, 4];
     */

    /**
     * The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes. (default: [0, Infinity])
     * @ko 아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다. (default: [0, Infinity])
     * @name Grid.JustifiedGrid#sizeRange
     * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["sizeRange"]}
     * @example
     * import { JustifiedGrid } from "@egjs/grid";
     *
     * const grid = new JustifiedGrid(container, {
     *   sizeRange: [0, Infinity],
     * });
     *
     * grid.sizeRange = [200, 800];
     */

    function getMaxPoint(outline) {
      var maxPoint = -Infinity;
      outline.forEach(function (point) {
        if (isFinite(point)) {
          maxPoint = Math.max(maxPoint, point);
        }
      });
      return isFinite(maxPoint) ? maxPoint : 0;
    }

    function getMinPoint(outline) {
      var minPoint = Infinity;
      outline.forEach(function (point) {
        if (isFinite(point)) {
          minPoint = Math.min(minPoint, point);
        }
      });
      return isFinite(minPoint) ? minPoint : 0;
    }

    function getOutlinePoint(startOutline, frameOutline, useFrameFill) {
      return getMaxPoint(startOutline) + getOutlineDist(startOutline, frameOutline, useFrameFill);
    }

    function getOutlineDist(startOutline, endOutline, useFrameFill) {
      var length = startOutline.length;

      if (!length) {
        return 0;
      }

      var minEndPoint = getMinPoint(endOutline);
      var maxStartPoint = getMaxPoint(startOutline);
      var frameDist = 0;

      if (!useFrameFill) {
        return 0;
      }

      for (var outlineIndex = 0; outlineIndex < length; ++outlineIndex) {
        var startPoint = startOutline[outlineIndex];
        var endPoint = endOutline[outlineIndex];

        if (!isFinite(startPoint) || !isFinite(endPoint)) {
          continue;
        }

        var startPos = startPoint - maxStartPoint;
        var endPos = endPoint - minEndPoint; // Fill empty block.

        frameDist = outlineIndex ? Math.max(frameDist, frameDist + startPos - endPos) : startPos - endPos;
      }

      return frameDist;
    }

    function fillOutlines(startOutline, endOutline, rect) {
      var inlinePos = rect.inlinePos,
          inlineSize = rect.inlineSize,
          contentPos = rect.contentPos,
          contentSize = rect.contentSize;

      for (var outlineIndex = inlinePos; outlineIndex < inlinePos + inlineSize; ++outlineIndex) {
        startOutline[outlineIndex] = Math.min(startOutline[outlineIndex], contentPos);
        endOutline[outlineIndex] = Math.max(endOutline[outlineIndex], contentPos + contentSize);
      }
    }
    /**
     * 'Frame' is a printing term with the meaning that 'it fits in one row wide'. FrameGrid is a grid that the card is filled up on the basis of a line given a size.
     * @ko 'Frame'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. FrameGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 카드가 가득 차도록 배치하는 Grid다.
     * @memberof Grid
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {Grid.FrameGrid.FrameGridOptions} options - The option object of the FrameGrid module <ko>FrameGrid 모듈의 옵션 객체</ko>
     */


    var FrameGrid =
    /*#__PURE__*/
    function (_super) {
      __extends(FrameGrid, _super);

      function FrameGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = FrameGrid.prototype;

      __proto.applyGrid = function (items, direction, outline) {
        var frame = this._getFrame();

        var frameInlineSize = frame.inlineSize,
            frameContentSize = frame.contentSize,
            frameRects = frame.rects;
        var _a = this.options,
            gap = _a.gap,
            useFrameFill = _a.useFrameFill;

        var _b = this.getRectSize(frameInlineSize),
            rectInlineSize = _b.inlineSize,
            rectContentSize = _b.contentSize;

        var itemsLength = items.length;

        if (!itemsLength || !frameInlineSize || !frameContentSize) {
          return {
            start: outline,
            end: outline
          };
        }

        var rectsLength = frameRects.length;
        var startOutline = range(frameInlineSize).map(function () {
          return Infinity;
        });
        var endOutline = range(frameInlineSize).map(function () {
          return -Infinity;
        });
        var frameOutline = frame.outline.map(function (point) {
          return point * (rectContentSize + gap);
        });

        for (var startIndex = 0; startIndex < itemsLength; startIndex += rectsLength) {
          // Compare group's startOutline and startOutline of rect
          var startPoint = getOutlinePoint(endOutline, frameOutline, useFrameFill);

          for (var rectIndex = 0; rectIndex < rectsLength && startIndex + rectIndex < itemsLength; ++rectIndex) {
            var item = items[startIndex + rectIndex];
            var _c = frameRects[rectIndex],
                frameRectContentPos = _c.contentPos,
                frameRectInlinePos = _c.inlinePos,
                frameRectContentSize = _c.contentSize,
                frameRectInlineSize = _c.inlineSize;
            var contentPos = startPoint + frameRectContentPos * (rectContentSize + gap);
            var inlinePos = frameRectInlinePos * (rectInlineSize + gap);
            var contentSize = frameRectContentSize * (rectContentSize + gap) - gap;
            var inlineSize = frameRectInlineSize * (rectInlineSize + gap) - gap;
            fillOutlines(startOutline, endOutline, {
              inlinePos: frameRectInlinePos,
              inlineSize: frameRectInlineSize,
              contentPos: contentPos,
              contentSize: contentSize + gap
            });
            item.setCSSGridRect({
              inlinePos: inlinePos,
              contentPos: contentPos,
              inlineSize: inlineSize,
              contentSize: contentSize
            });
          }
        }

        var isDirectionEnd = direction === "end";
        var gridOutline = outline;

        if (gridOutline.length !== frameInlineSize) {
          var point_1 = isDirectionEnd ? Math.max.apply(Math, gridOutline) : Math.min.apply(Math, gridOutline);
          gridOutline = range(frameInlineSize).map(function () {
            return point_1;
          });
        }

        startOutline = startOutline.map(function (point) {
          return isFinite(point) ? point : 0;
        });
        endOutline = endOutline.map(function (point) {
          return isFinite(point) ? point : 0;
        });
        var outlineDist = isDirectionEnd ? getOutlineDist(startOutline, gridOutline, useFrameFill) : getOutlineDist(gridOutline, endOutline, useFrameFill);
        items.forEach(function (item) {
          item.cssContentPos += outlineDist;
        });
        return {
          start: startOutline.map(function (point) {
            return point + outlineDist;
          }),
          end: endOutline.map(function (point) {
            return point + outlineDist;
          })
        };
      };

      __proto.getRectSize = function (frameInlineSize) {
        var _a = this.options,
            gap = _a.gap,
            rectSizeOption = _a.rectSize;

        if (typeof rectSizeOption === "object") {
          return rectSizeOption;
        }

        var rectSizeValue = rectSizeOption ? rectSizeOption : (this.getContainerInlineSize() + gap) / frameInlineSize - gap;
        return {
          inlineSize: rectSizeValue,
          contentSize: rectSizeValue
        };
      };

      __proto._getFrame = function () {
        var frame = this.options.frame;
        var frameContentSize = frame.length;
        var frameInlineSize = frameContentSize ? frame[0].length : 0;
        var rects = [];
        var passMap = {};
        var startOutline = range(frameInlineSize).map(function () {
          return Infinity;
        });
        var endOutline = range(frameInlineSize).map(function () {
          return -Infinity;
        });

        for (var y1 = 0; y1 < frameContentSize; ++y1) {
          for (var x1 = 0; x1 < frameInlineSize; ++x1) {
            var type = frame[y1][x1];

            if (!type) {
              continue;
            }

            if (passMap[y1 + "," + x1]) {
              continue;
            }

            var rect = this._findRect(passMap, type, y1, x1, frameInlineSize, frameContentSize);

            fillOutlines(startOutline, endOutline, rect);
            rects.push(rect);
          }
        }

        rects.sort(function (a, b) {
          return a.type < b.type ? -1 : 1;
        });
        return {
          rects: rects,
          inlineSize: frameInlineSize,
          contentSize: frameContentSize,
          outline: startOutline
        };
      };

      __proto._findRect = function (passMap, type, y1, x1, frameInlineSize, frameContentSize) {
        var frame = this.options.frame;
        var contentSize = 1;
        var inlineSize = 1; // find rect

        for (var x2 = x1; x2 < frameInlineSize; ++x2) {
          if (frame[y1][x2] === type) {
            inlineSize = x2 - x1 + 1;
            continue;
          }

          break;
        }

        for (var y2 = y1; y2 < frameContentSize; ++y2) {
          if (frame[y2][x1] === type) {
            contentSize = y2 - y1 + 1;
            continue;
          }

          break;
        } // pass rect


        for (var y = y1; y < y1 + contentSize; ++y) {
          for (var x = x1; x < x1 + inlineSize; ++x) {
            passMap[y + "," + x] = true;
          }
        }

        var rect = {
          type: type,
          inlinePos: x1,
          contentPos: y1,
          inlineSize: inlineSize,
          contentSize: contentSize
        };
        return rect;
      };

      FrameGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
        frame: PROPERTY_TYPE.RENDER_PROPERTY,
        useFrameFill: PROPERTY_TYPE.RENDER_PROPERTY,
        rectSize: PROPERTY_TYPE.RENDER_PROPERTY
      });
      FrameGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
        frame: [],
        rectSize: 0,
        useFrameFill: true
      });
      FrameGrid = __decorate([GetterSetter], FrameGrid);
      return FrameGrid;
    }(Grid);
    /**
     * The shape of the Grid. You can set the shape of the item as a 2d array. 0 and space are empty spaces, and the order of items is determined in ascending order. (default: [])
     * @ko grid의 모양. 2d 배열로 아이템의 모양을 설정할 수 있다. 0과 공백은 빈 공간이며 아이템의 순서는 오름차순으로 결정된다. (default: [])
     * @name Grid.FrameGrid#frame
     * @type {$ts:Grid.FrameGrid.FrameGridOptions["frame"]}
     * @example
     * import { FrameGrid } from "@egjs/grid";
     *
     * const grid = new FrameGrid(container, {
     *   frame: [
     *     [1, 1, 0, 0, 2, 3],
     *     [1, 1, 0, 4, 5, 5],
     *   ],
     * });
     *
     * grid.frame = [
     *   [1, 1, 0, 0, 2, 2],
     *   [1, 1, 0, 0, 2, 2],
     * ];
     */

    /**
     * Make sure that the frame can be attached after the previous frame. (default: true)
     * @ko 다음 프레임이 전 프레임에 이어 붙일 수 있는지 있는지 확인한다. (default: true)
     * @name Grid.FrameGrid#useFrameFill
     * @type {$ts:Grid.FrameGrid.FrameGridOptions["useFrameFill"]}
     * @example
     * import { FrameGrid } from "@egjs/grid";
     *
     * const grid = new FrameGrid(container, {
     *   useFrameFill: true,
     * });
     *
     * grid.useFrameFill = false;
     */

    /**
     * 1x1 rect size. If it is 0, it is determined by the number of columns in the frame. (default: 0)
     * @ko 1x1 직사각형 크기. 0이면 frame의 column의 개수에 의해 결정된다. (default: 0)
     * @name Grid.FrameGrid#rectSize
     * @type {$ts:Grid.FrameGrid.FrameGridOptions["rectSize"]}
     * @example
     * import { FrameGrid } from "@egjs/grid";
     *
     * const grid = new FrameGrid(container, {
     *   rectSize: 0,
     * });
     *
     * grid.rectSize = { inlineSize: 100, contentSize: 150 };
     */

    var BoxModel =
    /*#__PURE__*/
    function () {
      function BoxModel(status) {
        var boxStatus = __assign({
          orgInlineSize: 0,
          orgContentSize: 0,
          inlineSize: 0,
          contentSize: 0,
          inlinePos: 0,
          contentPos: 0,
          items: []
        }, status);

        for (var name in boxStatus) {
          this[name] = boxStatus[name];
        }
      }

      var __proto = BoxModel.prototype;

      __proto.scaleTo = function (inlineSize, contentSize) {
        var scaleX = this.inlineSize ? inlineSize / this.inlineSize : 0;
        var scaleY = this.contentSize ? contentSize / this.contentSize : 0;
        this.items.forEach(function (item) {
          if (scaleX !== 0) {
            item.inlinePos *= scaleX;
            item.inlineSize *= scaleX;
          }

          if (scaleY !== 0) {
            item.contentPos *= scaleY;
            item.contentSize *= scaleY;
          }
        });
        this.inlineSize = inlineSize;
        this.contentSize = contentSize;
      };

      __proto.push = function (item) {
        this.items.push(item);
      };

      __proto.getOrgSizeWeight = function () {
        return this.orgInlineSize * this.orgContentSize;
      };

      __proto.getSize = function () {
        return this.inlineSize * this.contentSize;
      };

      __proto.getOrgRatio = function () {
        return this.orgContentSize === 0 ? 0 : this.orgInlineSize / this.orgContentSize;
      };

      __proto.getRatio = function () {
        return this.contentSize === 0 ? 0 : this.inlineSize / this.contentSize;
      };

      return BoxModel;
    }();

    function getCost(originLength, length) {
      var cost = originLength / length;

      if (cost < 1) {
        cost = 1 / cost;
      }

      return cost - 1;
    }

    function fitArea(item, bestFitArea, itemFitSize, containerFitSize, layoutVertical) {
      item.contentSize = itemFitSize.contentSize;
      item.inlineSize = itemFitSize.inlineSize;
      bestFitArea.contentSize = containerFitSize.contentSize;
      bestFitArea.inlineSize = containerFitSize.inlineSize;

      if (layoutVertical) {
        item.contentPos = bestFitArea.contentPos + bestFitArea.contentSize;
        item.inlinePos = bestFitArea.inlinePos;
      } else {
        item.inlinePos = bestFitArea.inlinePos + bestFitArea.inlineSize;
        item.contentPos = bestFitArea.contentPos;
      }
    }
    /**
     * The PackingGrid is a layout that stacks cards with the same inlineSize as a stack of bricks. Adjust the inlineSize of all images to the same size, find the lowest contentSize column, and insert a necontentSize.
     *
     * @ko PackingGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 카드를 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 카드 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
     * @memberof Grid
     * @param {HTMLElement | string} container - A base element for a module <ko>모듈을 적용할 기준 엘리먼트</ko>
     * @param {Grid.PackingGrid.PackingGridOptions} options - The option object of the PackingGrid module <ko>PackingGrid 모듈의 옵션 객체</ko>
     */


    var PackingGrid =
    /*#__PURE__*/
    function (_super) {
      __extends(PackingGrid, _super);

      function PackingGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = PackingGrid.prototype;

      __proto.applyGrid = function (items, direction, outline) {
        var _this = this;

        var _a = this.options,
            aspectRatio = _a.aspectRatio,
            gap = _a.gap;
        var containerInlineSize = this.getContainerInlineSize();
        var containerContentSize = containerInlineSize / aspectRatio;
        var prevOutline = outline.length ? outline : [0];
        var startPoint = direction === "end" ? Math.max.apply(Math, prevOutline) : Math.min.apply(Math, prevOutline) - containerContentSize - gap;
        var endPoint = startPoint + containerContentSize + gap;
        var container = new BoxModel({});
        items.forEach(function (item) {
          var model = new BoxModel({
            inlineSize: item.inlineSize,
            contentSize: item.contentSize,
            orgInlineSize: item.orgInlineSize,
            orgContentSize: item.orgContentSize
          });

          _this._findBestFitArea(container, model);

          container.push(model);
          container.scaleTo(containerInlineSize + gap, containerContentSize + gap);
        });
        items.forEach(function (item, i) {
          var boxItem = container.items[i];
          var inlineSize = boxItem.inlineSize - gap;
          var contentSize = boxItem.contentSize - gap;
          var contentPos = startPoint + boxItem.contentPos;
          var inlinePos = boxItem.inlinePos;
          item.setCSSGridRect({
            inlinePos: inlinePos,
            contentPos: contentPos,
            inlineSize: inlineSize,
            contentSize: contentSize
          });
        });
        return {
          start: [startPoint],
          end: [endPoint]
        };
      };

      __proto._findBestFitArea = function (container, item) {
        if (container.getRatio() === 0) {
          // 아이템 최초 삽입시 전체영역 지정
          container.orgInlineSize = item.inlineSize;
          container.orgContentSize = item.contentSize;
          container.inlineSize = item.inlineSize;
          container.contentSize = item.contentSize;
          return;
        }

        var bestFitArea;
        var minCost = Infinity;
        var layoutVertical = false;
        var itemFitSize = {
          inlineSize: 0,
          contentSize: 0
        };
        var containerFitSize = {
          inlineSize: 0,
          contentSize: 0
        };
        var _a = this.options,
            sizeWeight = _a.sizeWeight,
            ratioWeight = _a.ratioWeight;
        container.items.forEach(function (item) {
          var containerSizeCost = getCost(item.getOrgSizeWeight(), item.getSize()) * sizeWeight;
          var containerRatioCost = getCost(item.getOrgRatio(), item.getRatio()) * ratioWeight;
          var inlineSize = item.inlineSize;
          var contentSize = item.contentSize;

          for (var i = 0; i < 2; ++i) {
            var itemInlineSize = void 0;
            var itemContentSize = void 0;
            var containerInlineSize = void 0;
            var containerContentSize = void 0;

            if (i === 0) {
              // add item to content pos (top, bottom)
              itemInlineSize = inlineSize;
              itemContentSize = contentSize * (item.contentSize / (item.orgContentSize + item.contentSize));
              containerInlineSize = inlineSize;
              containerContentSize = contentSize - itemContentSize;
            } else {
              // add item to inline pos (left, right)
              itemContentSize = contentSize;
              itemInlineSize = inlineSize * (item.inlineSize / (item.orgInlineSize + item.inlineSize));
              containerContentSize = contentSize;
              containerInlineSize = inlineSize - itemInlineSize;
            }

            var itemSize = itemInlineSize * itemContentSize;
            var itemRatio = itemInlineSize / itemContentSize;
            var containerSize = containerInlineSize * containerContentSize;
            var containerRatio = containerContentSize / containerContentSize;
            var cost = getCost(item.getSize(), itemSize) * sizeWeight;
            cost += getCost(item.getRatio(), itemRatio) * ratioWeight;
            cost += getCost(item.getOrgSizeWeight(), containerSize) * sizeWeight - containerSizeCost;
            cost += getCost(item.getOrgRatio(), containerRatio) * ratioWeight - containerRatioCost;

            if (cost === Math.min(cost, minCost)) {
              minCost = cost;
              bestFitArea = item;
              layoutVertical = i === 0;
              itemFitSize.inlineSize = itemInlineSize;
              itemFitSize.contentSize = itemContentSize;
              containerFitSize.inlineSize = containerInlineSize;
              containerFitSize.contentSize = containerContentSize;
            }
          }
        });
        fitArea(item, bestFitArea, itemFitSize, containerFitSize, layoutVertical);
      };

      PackingGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
        aspectRatio: PROPERTY_TYPE.RENDER_PROPERTY,
        sizeWeight: PROPERTY_TYPE.RENDER_PROPERTY,
        ratioWeight: PROPERTY_TYPE.RENDER_PROPERTY
      });
      PackingGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
        aspectRatio: 1,
        sizeWeight: 1,
        ratioWeight: 1
      });
      PackingGrid = __decorate([GetterSetter], PackingGrid);
      return PackingGrid;
    }(Grid);
    /**
     * Align of the position of the items. If you want to use `stretch`, be sure to set `column` or `columnSize` option. ("start", "center", "end", "justify", "stretch") (default: "justify")
     * @ko 아이템들의 위치의 정렬. `stretch`를 사용하고 싶다면 `column` 또는 `columnSize` 옵션을 설정해라.  ("start", "center", "end", "justify", "stretch") (default: "justify")
     * @name Grid.PackingGrid#align
     * @type {$ts:Grid.PackingGrid.PackingGridOptions["align"]}
     * @example
     * import { PackingGrid } from "@egjs/grid";
     *
     * const grid = new PackingGrid(container, {
     *   align: "start",
     * });
     *
     * grid.align = "justify";
     */

    /**
     * The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container.
     * @ko 열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0)
     * @name Grid.PackingGrid#column
     * @type {$ts:Grid.PackingGrid.PackingGridOptions["column"]}
     * @example
     * import { PackingGrid } from "@egjs/grid";
     *
     * const grid = new PackingGrid(container, {
     *   column: 0,
     * });
     *
     * grid.column = 4;
     */

    /**
     * The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0)
     * @ko 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0)
     * @name Grid.PackingGrid#columnSize
     * @type {$ts:Grid.PackingGrid.PackingGridOptions["columnSize"]}
     * @example
     * import { PackingGrid } from "@egjs/grid";
     *
     * const grid = new PackingGrid(container, {
     *   columnSize: 0,
     * });
     *
     * grid.columnSize = 200;
     */

    /**
     * The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0)
     * @ko 열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다.
     * @name Grid.PackingGrid#columnSizeRatio
     * @type {$ts:Grid.PackingGrid.PackingGridOptions["columnSizeRatio"]}
     * @example
     * import { PackingGrid } from "@egjs/grid";
     *
     * const grid = new PackingGrid(container, {
     *   columnSizeRatio: 0,
     * });
     *
     * grid.columnSizeRatio = 0.5;
     */



    var modules = {
        __proto__: null,
        'default': Grid,
        get PROPERTY_TYPE () { return PROPERTY_TYPE; },
        GRID_METHODS: GRID_METHODS,
        GRID_EVENTS: GRID_EVENTS,
        RECT_NAMES: RECT_NAMES,
        GetterSetter: GetterSetter,
        withGridMethods: withGridMethods,
        withMethods: withMethods,
        MasonryGrid: MasonryGrid,
        JustifiedGrid: JustifiedGrid,
        FrameGrid: FrameGrid,
        PackingGrid: PackingGrid,
        GridItem: GridItem,
        ContainerManager: ContainerManager
    };

    for (var name in modules) {
      Grid[name] = modules[name];
    }

    return Grid;

})));
//# sourceMappingURL=grid.js.map