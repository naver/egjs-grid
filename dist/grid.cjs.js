/*
Copyright (c) 2021-present NAVER Corp.
name: @egjs/grid
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-grid
version: 1.6.0
*/
'use strict';

var Component = require('@egjs/component');
var ImReady = require('@egjs/imready');
var childrenDiffer = require('@egjs/children-differ');

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
  preserveUIOnDestroy: false,
  defaultDirection: "end",
  externalContainerManager: null,
  externalItemRenderer: null,
  renderOnPropertyChange: true,
  useFit: true
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
  renderOnPropertyChange: PROPERTY_TYPE.PROPERTY,
  preserveUIOnDestroy: PROPERTY_TYPE.PROPERTY,
  useFit: PROPERTY_TYPE.PROPERTY
};
var GRID_METHODS = ["syncElements", "updateItems", "getItems", "setItems", "renderItems", "getContainerInlineSize", "getContainerElement"];
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
function (_super) {
  __extends(ContainerManager, _super);

  function ContainerManager(container, options) {
    var _this = _super.call(this) || this;

    _this.container = container;
    _this._resizeTimer = 0;
    _this._maxResizeDebounceTimer = 0;

    _this._onResize = function () {
      clearTimeout(_this._resizeTimer);
      clearTimeout(_this._maxResizeDebounceTimer);
      _this._maxResizeDebounceTimer = 0;
      _this._resizeTimer = 0;

      _this.trigger("resize");
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

    _this.options = __assign({
      horizontal: DEFAULT_GRID_OPTIONS.horizontal,
      autoResize: DEFAULT_GRID_OPTIONS.autoResize,
      resizeDebounce: DEFAULT_GRID_OPTIONS.resizeDebounce,
      maxResizeDebounce: DEFAULT_GRID_OPTIONS.maxResizeDebounce
    }, options);

    _this._init();

    return _this;
  }

  var __proto = ContainerManager.prototype;

  __proto.resize = function () {
    var container = this.container;
    this.setRect({
      width: container.clientWidth,
      height: container.clientHeight
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

    window.removeEventListener("resize", this._scheduleResize);

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

    if (this.options.autoResize) {
      window.addEventListener("resize", this._scheduleResize);
    }
  };

  return ContainerManager;
}(Component);

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
    var descriptor = Object.getOwnPropertyDescriptor(prototype, name) || {};

    var getter = descriptor.get || function get() {
      return this.options[name];
    };

    var setter = descriptor.set || function set(value) {
      var options = this.options;
      var prevValue = options[name];

      if (prevValue === value) {
        return;
      }

      options[name] = value;

      if (shouldRender && options.renderOnPropertyChange) {
        this.scheduleRender();
      }
    };

    var attributes = {
      enumerable: true,
      configurable: true,
      get: getter,
      set: setter
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
function getRangeCost(value, valueRange) {
  return Math.max(value - valueRange[1], valueRange[0] - value, 0) + 1;
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
    var isLoading = item.updateState === UPDATE_STATE.WAIT_LOADING;
    var hasOrgSize = orgRect && orgRect.width && orgRect.height;
    var rect;

    if (isEqualSize && initialRect) {
      rect = initialRect;
    } else if (isConstantSize && hasOrgSize && !isLoading) {
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

    if (!item.isFirstUpdate) {
      item.orgRect = __assign({}, rect);
    }

    item.rect = __assign({}, rect);

    if (item.element) {
      item.mountState = MOUNT_STATE.MOUNTED;
    }

    if (item.updateState === UPDATE_STATE.NEED_UPDATE) {
      item.updateState = UPDATE_STATE.UPDATED;
      item.isFirstUpdate = true;
    }

    item.attributes = element ? getDataAttributes(element, this.options.attributePrefix) : {};

    if (!isLoading) {
      this.initialRect = __assign({}, rect);
    }

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
    this.isUpdate = false;
    this.hasTransition = false;
    this.transitionDuration = "";
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
      isFirstUpdate: false,
      mountState: MOUNT_STATE.UNCHECKED,
      updateState: UPDATE_STATE.NEED_UPDATE,
      element: element || null,
      orgCSSText: (_a = element === null || element === void 0 ? void 0 : element.style.cssText) !== null && _a !== void 0 ? _a : "",
      gridData: {}
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
      var orgRect = this.orgRect || this.rect;
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
      var orgRect = this.orgRect || this.rect;
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
      isFirstUpdate: this.isFirstUpdate,
      element: null,
      key: this.key,
      orgRect: this.orgRect,
      rect: this.rect,
      cssRect: this.cssRect,
      gridData: this.gridData,
      data: this.data
    };
  };
  /**
   * Returns minimized status of the item.
   * @ko 아이템의 간소화된 상태를 반환한다.
   */


  __proto.getMinimizedStatus = function () {
    var status = {
      orgRect: this.orgRect,
      rect: this.rect,
      cssRect: this.cssRect,
      attributes: this.attributes,
      gridData: this.gridData
    };

    if (typeof this.key !== "undefined") {
      status.key = this.key;
    }

    if (this.mountState !== MOUNT_STATE.UNCHECKED) {
      status.mountState = this.mountState;
    }

    if (this.updateState !== UPDATE_STATE.NEED_UPDATE) {
      status.updateState = this.updateState;
    }

    if (this.isFirstUpdate) {
      status.isFirstUpdate = true;
    }

    if (this.orgCSSText) {
      status.orgCSSText = this.orgCSSText;
    }

    return status;
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

    _this._onResize = function () {
      _this.renderItems({
        useResize: true
      });
    };

    _this.options = __assign(__assign({}, _this.constructor.defaultOptions), options);
    _this.containerElement = isString(containerElement) ? document.querySelector(containerElement) : containerElement;
    var _a = _this.options,
        isEqualSize = _a.isEqualSize,
        isConstantSize = _a.isConstantSize,
        useTransform = _a.useTransform,
        horizontal = _a.horizontal,
        percentage = _a.percentage,
        externalContainerManager = _a.externalContainerManager,
        externalItemRenderer = _a.externalItemRenderer,
        resizeDebounce = _a.resizeDebounce,
        maxResizeDebounce = _a.maxResizeDebounce,
        autoResize = _a.autoResize; // TODO: 테스트용 설정

    _this.containerManager = externalContainerManager || new ContainerManager(_this.containerElement, {
      horizontal: horizontal,
      resizeDebounce: resizeDebounce,
      maxResizeDebounce: maxResizeDebounce,
      autoResize: autoResize
    }).on("resize", _this._onResize);
    _this.itemRenderer = externalItemRenderer || new ItemRenderer({
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
   * Return Container Element.
   * @ko 컨테이너 엘리먼트를 반환한다.
   */

  __proto.getContainerElement = function () {
    return this.containerElement;
  };
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
   * @param outlines - The outlines to set. <ko>설정할 아웃라인.</ko>
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

    var _a = childrenDiffer.diff(this.items.map(function (item) {
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
   * Rearrange items to fit the grid and render them. When rearrange is complete, the `renderComplete` event is fired.
   * @ko grid에 맞게 아이템을 재배치하고 렌더링을 한다. 배치가 완료되면 `renderComplete` 이벤트가 발생한다.
   * @param - Options for rendering. <ko>렌더링을 하기 위한 옵션.</ko>
   * @example
   * ```js
   * import { MasonryGrid } from "@egjs/grid";
   * const grid = new MasonryGrid();
   *
   * grid.on("renderComplete", e => {
   *   console.log(e);
   * });
   * grid.renderItems();
   * ```
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
   * @param - Whether to minimize the status of the item. (default: false) <ko>item의 status를 최소화할지 여부. (default: false)</ko>
   */


  __proto.getStatus = function (minimize) {
    return {
      outlines: this.outlines,
      items: this.items.map(function (item) {
        return minimize ? item.getMinimizedStatus() : item.getStatus();
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
          direction: _this.defaultDirection,
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

    var _b = options.preserveUI,
        preserveUI = _b === void 0 ? this.options.preserveUIOnDestroy : _b;
    this.containerManager.destroy({
      preserveUI: preserveUI
    });

    if (!preserveUI) {
      this.items.forEach(function (_a) {
        var element = _a.element,
            orgCSSText = _a.orgCSSText;

        if (element) {
          element.style.cssText = orgCSSText;
        }
      });
    }

    (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
  };

  __proto.checkReady = function (options) {
    var _this = this;

    var _a;

    if (options === void 0) {
      options = {};
    } // Grid: renderItems => checkReady => readyItems => applyGrid


    var items = this.items;
    var updated = items.filter(function (item) {
      var _a;

      return ((_a = item.element) === null || _a === void 0 ? void 0 : _a.parentNode) && item.updateState !== UPDATE_STATE.UPDATED;
    });
    var mounted = updated.filter(function (item) {
      return item.mountState !== MOUNT_STATE.MOUNTED;
    });
    var moreUpdated = [];
    mounted.filter(function (item) {
      if (item.hasTransition) {
        return true;
      } else {
        var element = item.element;
        var transitionDuration = parseFloat(getComputedStyle(element).transitionDuration);

        if (transitionDuration > 0) {
          item.hasTransition = true;
          item.transitionDuration = element.style.transitionDuration;
          return true;
        }
      }

      return false;
    }).forEach(function (item) {
      item.element.style.transitionDuration = "0s";
    });
    (_a = this._im) === null || _a === void 0 ? void 0 : _a.destroy();
    this._im = new ImReady({
      prefix: this.options.attributePrefix
    }).on("preReadyElement", function (e) {
      updated[e.index].updateState = UPDATE_STATE.WAIT_LOADING;
    }).on("preReady", function () {
      _this.itemRenderer.updateItems(updated);

      _this.readyItems(mounted, updated, options);
    }).on("readyElement", function (e) {
      var item = updated[e.index];
      item.updateState = UPDATE_STATE.NEED_UPDATE; // after preReady

      if (e.isPreReadyOver) {
        item.element.style.cssText = item.orgCSSText;

        _this.itemRenderer.updateItems([item]);

        _this.readyItems([], [item], options);
      }
    }).on("error", function (e) {
      var item = items[e.index];
      /**
       * This event is fired when an error occurs in the content.
       * @ko 콘텐츠 로드에 에러가 날 때 발생하는 이벤트.
       * @event Grid#contentError
       * @param {Grid.OnContentError} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
       * @example
       * ```js
       * grid.on("contentError", e => {
       *   e.update();
       * });
       * ```
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

  __proto.fitOutlines = function (useFit) {
    if (useFit === void 0) {
      useFit = this.useFit;
    }

    var outlines = this.outlines;
    var startOutline = outlines.start;
    var endOutline = outlines.end;
    var outlineOffset = startOutline.length ? Math.min.apply(Math, startOutline) : 0; // If the outline is less than 0, a fit occurs forcibly.

    if (!useFit && outlineOffset > 0) {
      return;
    }

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

  __proto.readyItems = function (mounted, updated, options) {
    var prevOutlines = this.outlines;
    var direction = options.direction || this.options.defaultDirection;
    var prevOutline = options.outline || prevOutlines[direction === "end" ? "start" : "end"];
    var items = this.items;
    var nextOutlines = {
      start: __spreadArrays(prevOutline),
      end: __spreadArrays(prevOutline)
    };
    updated.forEach(function (item) {
      item.isUpdate = true;
    });

    if (items.length) {
      nextOutlines = this.applyGrid(this.items, direction, prevOutline);
    }

    updated.forEach(function (item) {
      item.isUpdate = false;
    });
    this.setOutlines(nextOutlines);
    this.fitOutlines();
    this.itemRenderer.renderItems(this.items);

    this._refreshContainerContentSize();

    var transitionMounted = mounted.filter(function (item) {
      return item.hasTransition;
    });

    if (transitionMounted.length) {
      this.containerManager.resize();
      transitionMounted.forEach(function (item) {
        var element = item.element;
        element.style.transitionDuration = item.transitionDuration;
      });
    }

    this._renderComplete({
      direction: direction,
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
     * @example
     * ```js
     * grid.on("renderComplete", e => {
     *   console.log(e.mounted, e.updated, e.useResize);
     * });
     * ```
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
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   gap: 0,
 * });
 *
 * grid.gap = 5;
 * ```
 */

/**
 * The default direction value when direction is not set in the render option.
 * @ko render옵션에서 direction을 미설정시의 기본 방향값.
 * @name Grid#defaultDirection
 * @type {$ts:Grid.GridOptions["defaultDirection"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   defaultDirection: "end",
 * });
 *
 * grid.defaultDirection = "start";
 * ```
 */

/**
 * Whether to move the outline to 0 when the top is empty when rendering. However, if it overflows above the top, the outline is forced to 0. (default: true)
 * @ko 렌더링시 상단이 비어있을 때 아웃라인을 0으로 이동시킬지 여부. 하지만 상단보다 넘치는 경우 아웃라인을 0으로 강제 이동한다. (default: true)
 * @name Grid#useFit
 * @type {$ts:Grid.GridOptions["useFit"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   useFit: true,
 * });
 *
 * grid.useFit = false;
 * ```
 */

/**
 * Whether to preserve the UI of the existing container or item when destroying.
 * @ko destroy 시 기존 컨테이너, 아이템의 UI를 보존할지 여부.
 * @name Grid#preserveUIOnDestroy
 * @type {$ts:Grid.GridOptions["preserveUIOnDestroy"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   preserveUIOnDestroy: false,
 * });
 *
 * grid.preserveUIOnDestroy = true;
 * ```
 */

function getColumnPoint(outline, columnIndex, columnCount, pointCaculationName) {
  return Math[pointCaculationName].apply(Math, outline.slice(columnIndex, columnIndex + columnCount));
}

function getColumnIndex(outline, columnCount, nearestCalculationName) {
  var length = outline.length - columnCount + 1;
  var pointCaculationName = nearestCalculationName === "max" ? "min" : "max";
  var indexCaculationName = nearestCalculationName === "max" ? "lastIndexOf" : "indexOf";
  var points = range(length).map(function (index) {
    return getColumnPoint(outline, index, columnCount, pointCaculationName);
  });
  return points[indexCaculationName](Math[nearestCalculationName].apply(Math, points));
}
/**
 * MasonryGrid is a grid that stacks items with the same width as a stack of bricks. Adjust the width of all images to the same size, find the lowest height column, and insert a new item.
 *
 * @ko MasonryGrid는 벽돌을 쌓아 올린 모양처럼 동일한 너비를 가진 아이템를 쌓는 레이아웃이다. 모든 이미지의 너비를 동일한 크기로 조정하고, 가장 높이가 낮은 열을 찾아 새로운 이미지를 삽입한다. 따라서 배치된 아이템 사이에 빈 공간이 생기지는 않지만 배치된 레이아웃의 아래쪽은 울퉁불퉁해진다.
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
        columnSizeRatio = _a.columnSizeRatio,
        columnSizeOption = _a.columnSize;
    var outlineLength = outline.length;
    var itemsLength = items.length;

    var alignPoses = this._getAlignPoses();

    var isEndDirection = direction === "end";
    var nearestCalculationName = isEndDirection ? "min" : "max";
    var pointCalculationName = isEndDirection ? "max" : "min";
    var startOutline = [0];

    if (outlineLength === column) {
      startOutline = outline.slice();
    } else {
      var point_1 = outlineLength ? Math[pointCalculationName].apply(Math, outline) : 0;
      startOutline = range(column).map(function () {
        return point_1;
      });
    }

    var endOutline = startOutline.slice();
    var columnDist = column > 1 ? alignPoses[1] - alignPoses[0] : 0;
    var isStretch = align === "stretch";

    var _loop_1 = function (i) {
      var item = items[isEndDirection ? i : itemsLength - 1 - i];
      var columnAttribute = parseInt(item.attributes.column || "1", 10);
      var maxColumnAttribute = parseInt(item.attributes.maxColumn || "1", 10);
      var inlineSize = item.inlineSize;
      var contentSize = item.contentSize;
      var columnCount = Math.min(column, columnAttribute || Math.max(1, Math.ceil((inlineSize + gap) / columnDist)));
      var maxColumnCount = Math.min(column, Math.max(columnCount, maxColumnAttribute));
      var columnIndex = getColumnIndex(endOutline, columnCount, nearestCalculationName);
      var contentPos = getColumnPoint(endOutline, columnIndex, columnCount, pointCalculationName);

      while (columnCount < maxColumnCount) {
        var nextEndColumnIndex = columnIndex + columnCount;
        var nextColumnIndex = columnIndex - 1;

        if (isEndDirection && (nextEndColumnIndex >= column || endOutline[nextEndColumnIndex] > contentPos)) {
          break;
        }

        if (!isEndDirection && (nextColumnIndex < 0 || endOutline[nextColumnIndex]) < contentPos) {
          break;
        }

        if (!isEndDirection) {
          --columnIndex;
        }

        ++columnCount;
      }

      columnIndex = Math.max(0, columnIndex);
      columnCount = Math.min(column - columnIndex, columnCount);

      if (columnAttribute > 0 && (columnCount > 1 || isStretch || columnSizeOption)) {
        inlineSize = (columnCount - 1) * columnDist + columnSize;
        item.cssInlineSize = inlineSize;
      }

      if (columnSizeRatio > 0) {
        contentSize = inlineSize / columnSizeRatio;
        item.cssContentSize = contentSize;
      }

      var inlinePos = alignPoses[columnIndex];
      contentPos = isEndDirection ? contentPos : contentPos - gap - contentSize;
      item.cssInlinePos = inlinePos;
      item.cssContentPos = contentPos;
      var nextOutlinePoint = isEndDirection ? contentPos + contentSize + gap : contentPos;
      range(columnCount).forEach(function (indexOffset) {
        endOutline[columnIndex + indexOffset] = nextOutlinePoint;
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
    } else if (items.length) {
      var checkedItem = items[0];

      for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var attributes = item.attributes;

        if (item.updateState !== UPDATE_STATE.UPDATED || !item.inlineSize || attributes.column || attributes.maxColumnCount) {
          continue;
        }

        checkedItem = item;
        break;
      }

      var inlineSize = checkedItem.inlineSize || 0;
      this._columnSize = inlineSize;
      return inlineSize;
    }

    this._columnSize = this._columnSize || 0;
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
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   align: "start",
 * });
 *
 * grid.align = "justify";
 * ```
 */

/**
 * The number of columns. If the number of columns is 0, it is automatically calculated according to the size of the container.
 * @ko 열의 개수. 열의 개수가 0이라면, 컨테이너의 사이즈에 의해 계산이 된다. (default: 0)
 * @name Grid.MasonryGrid#column
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["column"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   column: 0,
 * });
 *
 * grid.column = 4;
 * ```
 */

/**
 * The size of the columns. If it is 0, it is calculated as the size of the first item in items. (default: 0)
 * @ko 열의 사이즈. 만약 열의 사이즈가 0이면, 아이템들의 첫번째 아이템의 사이즈로 계산이 된다. (default: 0)
 * @name Grid.MasonryGrid#columnSize
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSize"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   columnSize: 0,
 * });
 *
 * grid.columnSize = 200;
 * ```
 */

/**
 * The size ratio(inlineSize / contentSize) of the columns. 0 is not set. (default: 0)
 * @ko 열의 사이즈 비율(inlineSize / contentSize). 0은 미설정이다.
 * @name Grid.MasonryGrid#columnSizeRatio
 * @type {$ts:Grid.MasonryGrid.MasonryGridOptions["columnSizeRatio"]}
 * @example
 * ```js
 * import { MasonryGrid } from "@egjs/grid";
 *
 * const grid = new MasonryGrid(container, {
 *   columnSizeRatio: 0,
 * });
 *
 * grid.columnSizeRatio = 0.5;
 * ```
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

function splitItems(items, path) {
  var length = path.length;
  var groups = [];

  for (var i = 0; i < length - 1; ++i) {
    var path1 = parseInt(path[i], 10);
    var path2 = parseInt(path[i + 1], 10);
    groups.push(items.slice(path1, path2));
  }

  return groups;
}

function getExpectedColumnSize(item, rowSize) {
  var inlineSize = item.orgInlineSize;
  var contentSize = item.orgContentSize;

  if (!inlineSize || !contentSize) {
    return 0;
  }

  var inlineOffset = parseFloat(item.gridData.inlineOffset) || 0;
  var contentOffset = parseFloat(item.gridData.contentOffset) || 0;
  return (inlineSize - inlineOffset) / (contentSize - contentOffset) * (rowSize - contentOffset) + inlineOffset;
}
/**
 * 'justified' is a printing term with the meaning that 'it fits in one row wide'. JustifiedGrid is a grid that the item is filled up on the basis of a line given a size.
 * If 'data-grid-inline-offset' or 'data-grid-content-offset' are set for item element, the ratio is maintained except for the offset value.
 * If 'data-grid-maintained-target' is set for an element whose ratio is to be maintained, the item is rendered while maintaining the ratio of the element.
 * @ko 'justified'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. JustifiedGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 아이템가 가득 차도록 배치하는 Grid다.
 * 아이템 엘리먼트에 'data-grid-inline-offset' 또는 'data-grid-content-offset'를 설정하면 offset 값을 제외하고 비율을 유지한다.
 * 비율을 유지하고 싶은 엘리먼트에 'data-grid-maintained-target'을 설정한다면 해당 엘리먼트의 비율을 유지하면서 아이템이 렌더링이 된다.
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
    var _a = this.options,
        attributePrefix = _a.attributePrefix,
        horizontal = _a.horizontal;
    items.forEach(function (item) {
      if (!item.isUpdate) {
        return;
      }

      var element = item.element;
      var attributes = item.attributes;
      var gridData = item.gridData;
      var inlineOffset = parseFloat(attributes.inlineOffset) || gridData.inlineOffset || 0;
      var contentOffset = parseFloat(attributes.contentOffset) || gridData.contentOffset | 0;

      if (element && !("inlineOffset" in attributes) && !("contentOffset" in attributes) && item.mountState === MOUNT_STATE.MOUNTED) {
        var maintainedTarget = element.querySelector("[" + attributePrefix + "maintained-target]");

        if (maintainedTarget) {
          var widthOffset = element.offsetWidth - element.clientWidth + element.scrollWidth - maintainedTarget.clientWidth;
          var heightOffset = element.offsetHeight - element.clientHeight + element.scrollHeight - maintainedTarget.clientHeight;

          if (horizontal) {
            inlineOffset = heightOffset;
            contentOffset = widthOffset;
          } else {
            inlineOffset = widthOffset;
            contentOffset = heightOffset;
          }
        }
      }

      gridData.inlineOffset = inlineOffset;
      gridData.contentOffset = contentOffset;
    });
    var rowRange = this.options.rowRange;
    var path = [];

    if (items.length) {
      path = rowRange ? this._getRowPath(items) : this._getPath(items);
    }

    return this._setStyle(items, path, outline, direction === "end");
  };

  __proto._getRowPath = function (items) {
    var _a;

    var columnRange = this._getColumnRange();

    var rowRange = this._getRowRange();

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

  __proto._getExpectedRowSize = function (items) {
    var gap = this.options.gap;
    var containerInlineSize = this.getContainerInlineSize() - gap * (items.length - 1);
    var ratioSum = 0;
    var inlineSum = 0;
    items.forEach(function (item) {
      var inlineSize = item.orgInlineSize;
      var contentSize = item.orgContentSize;

      if (!inlineSize || !contentSize) {
        return;
      } // sum((expect - offset) * ratio) = container inline size


      var inlineOffset = parseFloat(item.gridData.inlineOffset) || 0;
      var contentOffset = parseFloat(item.gridData.contentOffset) || 0;
      var maintainedRatio = (inlineSize - inlineOffset) / (contentSize - contentOffset);
      ratioSum += maintainedRatio;
      inlineSum += contentOffset * maintainedRatio;
      containerInlineSize -= inlineOffset;
    });
    return ratioSum ? (containerInlineSize + inlineSum) / ratioSum : 0;
  };

  __proto._getExpectedInlineSize = function (items, rowSize) {
    var gap = this.options.gap;
    var size = items.reduce(function (sum, item) {
      return sum + getExpectedColumnSize(item, rowSize);
    }, 0);
    return size ? size + gap * (items.length - 1) : 0;
  };

  __proto._getCost = function (items, i, j) {
    var lineItems = items.slice(i, j);

    var rowSize = this._getExpectedRowSize(lineItems);

    var _a = this._getSizeRange(),
        minSize = _a[0],
        maxSize = _a[1];

    if (this.isCroppedSize) {
      if (minSize <= rowSize && rowSize <= maxSize) {
        return 0;
      }

      var expectedInlineSize = this._getExpectedInlineSize(lineItems, rowSize < minSize ? minSize : maxSize);

      return Math.pow(expectedInlineSize - this.getContainerInlineSize(), 2);
    }

    if (isFinite(maxSize)) {
      // if this size is not in range, the cost increases sharply.
      if (rowSize < minSize) {
        return Math.pow(rowSize - minSize, 2) + Math.pow(maxSize, 2);
      } else if (rowSize > maxSize) {
        return Math.pow(rowSize - maxSize, 2) + Math.pow(maxSize, 2);
      }
    } else if (rowSize < minSize) {
      return Math.max(Math.pow(minSize, 2), Math.pow(rowSize, 2)) + Math.pow(maxSize, 2);
    } // if this size in range, the cost is row


    return rowSize - minSize;
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
    var _this = this;

    if (outline === void 0) {
      outline = [];
    }

    var _a = this.options,
        gap = _a.gap,
        isCroppedSize = _a.isCroppedSize,
        displayedRow = _a.displayedRow;

    var sizeRange = this._getSizeRange();

    var startPoint = outline[0] || 0;
    var containerInlineSize = this.getContainerInlineSize();
    var groups = splitItems(items, path);
    var contentPos = startPoint;
    var displayedSize = 0;
    groups.forEach(function (groupItems, rowIndex) {
      var length = groupItems.length;

      var rowSize = _this._getExpectedRowSize(groupItems);

      if (isCroppedSize) {
        rowSize = Math.max(sizeRange[0], Math.min(rowSize, sizeRange[1]));
      }

      var expectedInlineSize = _this._getExpectedInlineSize(groupItems, rowSize);

      var allGap = gap * (length - 1);
      var scale = (containerInlineSize - allGap) / (expectedInlineSize - allGap);
      groupItems.forEach(function (item, i) {
        var columnSize = getExpectedColumnSize(item, rowSize);
        var prevItem = groupItems[i - 1];
        var inlinePos = prevItem ? prevItem.cssInlinePos + prevItem.cssInlineSize + gap : 0;

        if (isCroppedSize) {
          columnSize *= scale;
        }

        item.setCSSGridRect({
          inlinePos: inlinePos,
          contentPos: contentPos,
          inlineSize: columnSize,
          contentSize: rowSize
        });
      });
      contentPos += gap + rowSize;

      if (displayedRow < 0 || rowIndex < displayedRow) {
        displayedSize = contentPos;
      }
    });

    if (isEndDirection) {
      // previous group's end outline is current group's start outline
      return {
        start: [startPoint],
        end: [displayedSize]
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

  __proto._getRowRange = function () {
    var rowRange = this.rowRange;
    return isObject(rowRange) ? rowRange : [rowRange, rowRange];
  };

  __proto._getColumnRange = function () {
    var columnRange = this.columnRange;
    return isObject(columnRange) ? columnRange : [columnRange, columnRange];
  };

  __proto._getSizeRange = function () {
    var sizeRange = this.sizeRange;
    return isObject(sizeRange) ? sizeRange : [sizeRange, sizeRange];
  };

  JustifiedGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
    columnRange: PROPERTY_TYPE.RENDER_PROPERTY,
    rowRange: PROPERTY_TYPE.RENDER_PROPERTY,
    sizeRange: PROPERTY_TYPE.RENDER_PROPERTY,
    isCroppedSize: PROPERTY_TYPE.RENDER_PROPERTY,
    displayedRow: PROPERTY_TYPE.RENDER_PROPERTY
  });
  JustifiedGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
    columnRange: [1, 8],
    rowRange: 0,
    sizeRange: [0, Infinity],
    displayedRow: -1,
    isCroppedSize: false
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
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   columnRange: [1, 8],
 * });
 *
 * grid.columnRange = [3, 6];
 * ```
 */

/**
 * The minimum and maximum number of rows in a group, 0 is not set. (default: 0)
 * @ko 한 그룹에 들어가는 행의 최소, 최대 개수, 0은 미설정이다. (default: 0)
 * @name Grid.JustifiedGrid#rowRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["rowRange"]}
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   rowRange: 0,
 * });
 *
 * grid.rowRange = [3, 4];
 * ```
 */

/**
 * The minimum and maximum size by which the item is adjusted. If it is not calculated, it may deviate from the minimum and maximum sizes. (default: [0, Infinity])
 * @ko 아이템이 조정되는 최소, 최대 사이즈. 계산이 되지 않는 경우 최소, 최대 사이즈를 벗어날 수 있다. (default: [0, Infinity])
 * @name Grid.JustifiedGrid#sizeRange
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["sizeRange"]}
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   sizeRange: [0, Infinity],
 * });
 *
 * grid.sizeRange = [200, 800];
 * ```
 */

/**
 * Maximum number of rows to be counted for container size. You can hide it on the screen by setting overflow: hidden. -1 is not set. (default: -1)
 * @ko - 컨테이너 크기에 계산될 최대 row 개수. overflow: hidden을 설정하면 화면에 가릴 수 있다. -1은 미설정이다. (default: -1)
 * @name Grid.JustifiedGrid#displayedRow
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["displayedRow"]}
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   displayedRow: -1,
 * });
 *
 * grid.displayedRow = 3;
 * ```
 */

/**
 * Whether to crop when the row size is out of sizeRange. If set to true, this ratio can be broken. (default: false)
 * @ko - row 사이즈가 sizeRange에 벗어나면 크롭할지 여부. true로 설정하면 비율이 깨질 수 있다. (default: false)
 * @name Grid.JustifiedGrid#isCroppedSize
 * @type {$ts:Grid.JustifiedGrid.JustifiedGridOptions["isCroppedSize"]}
 * @example
 * ```js
 * import { JustifiedGrid } from "@egjs/grid";
 *
 * const grid = new JustifiedGrid(container, {
 *   sizeRange: [200, 250],
 *   isCroppedSize: false,
 * });
 *
 * grid.isCroppedSize = true;
 * ```
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
 * 'Frame' is a printing term with the meaning that 'it fits in one row wide'. FrameGrid is a grid that the item is filled up on the basis of a line given a size.
 * @ko 'Frame'는 '1행의 너비에 맞게 꼭 들어찬'이라는 의미를 가진 인쇄 용어다. FrameGrid는 용어의 의미대로 너비가 주어진 사이즈를 기준으로 아이템이 가득 차도록 배치하는 Grid다.
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
    var gridOutline = outline.length ? outline : [0];

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
    var outlineDist = isDirectionEnd ? getOutlinePoint(gridOutline, startOutline, useFrameFill) : getOutlinePoint(endOutline, gridOutline, useFrameFill);
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
 * The shape of the grid. You can set the shape and order of items with a 2d array ([contentPos][inlinePos]). You can place items as many times as you fill the array with numbers, and zeros and spaces are empty spaces. The order of the items is arranged in ascending order of the numeric values that fill the array. (default: [])
 * @ko Grid의 모양. 2d 배열([contentPos][inlinePos])로 아이템의 모양과 순서를 설정할 수 있다. 숫자로 배열을 채운만큼 아이템을 배치할 수 있으며 0과 공백은 빈 공간이다. 아이템들의 순서는 배열을 채운 숫자값의 오름차순대로 배치가 된다. (default: [])
 * @name Grid.FrameGrid#frame
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["frame"]}
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * // Item 1 : 2 x 2
 * // Item 2 : 1 x 1
 * // Item 3 : 1 x 2
 * // Item 4 : 1 x 1
 * // Item 5 : 2 x 1
 * const grid = new FrameGrid(container, {
 *   frame: [
 *     [1, 1, 0, 0, 2, 3],
 *     [1, 1, 0, 4, 5, 5],
 *   ],
 * });
 *
 * // Item 1 : 2 x 2
 * // Item 2 : 2 x 2
 * grid.frame = [
 *   [1, 1, 0, 0, 2, 2],
 *   [1, 1, 0, 0, 2, 2],
 * ];
 * ```
 */

/**
 * Make sure that the frame can be attached after the previous frame. (default: true)
 * @ko 다음 프레임이 전 프레임에 이어 붙일 수 있는지 있는지 확인한다. (default: true)
 * @name Grid.FrameGrid#useFrameFill
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["useFrameFill"]}
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * const grid = new FrameGrid(container, {
 *   useFrameFill: true,
 * });
 *
 * grid.useFrameFill = false;
 * ```
 */

/**
 * 1x1 rect size. If it is 0, it is determined by the number of columns in the frame. (default: 0)
 * @ko 1x1 직사각형 크기. 0이면 frame의 column의 개수에 의해 결정된다. (default: 0)
 * @name Grid.FrameGrid#rectSize
 * @type {$ts:Grid.FrameGrid.FrameGridOptions["rectSize"]}
 * @example
 * ```js
 * import { FrameGrid } from "@egjs/grid";
 *
 * const grid = new FrameGrid(container, {
 *   rectSize: 0,
 * });
 *
 * grid.rectSize = { inlineSize: 100, contentSize: 150 };
 * ```
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

function fitArea(item, bestFitArea, itemFitSize, containerFitSize, isContentDirection) {
  item.contentSize = itemFitSize.contentSize;
  item.inlineSize = itemFitSize.inlineSize;
  bestFitArea.contentSize = containerFitSize.contentSize;
  bestFitArea.inlineSize = containerFitSize.inlineSize;

  if (isContentDirection) {
    item.contentPos = bestFitArea.contentPos + bestFitArea.contentSize;
    item.inlinePos = bestFitArea.inlinePos;
  } else {
    item.inlinePos = bestFitArea.inlinePos + bestFitArea.inlineSize;
    item.contentPos = bestFitArea.contentPos;
  }
}
/**
 * The PackingGrid is a grid that shows the important items bigger without sacrificing the weight of the items.
 * Rows and columns are separated so that items are dynamically placed within the horizontal and vertical space rather than arranged in an orderly fashion.
 * If `sizeWeight` is higher than `ratioWeight`, the size of items is preserved as much as possible.
 * Conversely, if `ratioWeight` is higher than `sizeWeight`, the ratio of items is preserved as much as possible.
 * @ko PackingGrid는 아이템의 본래 크기에 따른 비중을 해치지 않으면서 중요한 카드는 더 크게 보여 주는 레이아웃이다.
 * 행과 열이 구분돼 아이템을 정돈되게 배치하는 대신 가로세로 일정 공간 내에서 동적으로 아이템을 배치한다.
 * `sizeWeight`가 `ratioWeight`보다 높으면 아이템들의 size가 최대한 보존이 된다.
 * 반대로 `ratioWeight`가 `sizeWeight`보다 높으면 아이템들의 비율이 최대한 보존이 된다.
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
        inlineSize: item.orgInlineSize,
        contentSize: item.orgContentSize,
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
    var isContentDirection = false;
    var itemFitSize = {
      inlineSize: 0,
      contentSize: 0
    };
    var containerFitSize = {
      inlineSize: 0,
      contentSize: 0
    };

    var sizeWeight = this._getWeight("size");

    var ratioWeight = this._getWeight("ratio");

    container.items.forEach(function (child) {
      var containerSizeCost = getCost(child.getOrgSizeWeight(), child.getSize()) * sizeWeight;
      var containerRatioCost = getCost(child.getOrgRatio(), child.getRatio()) * ratioWeight;
      var inlineSize = child.inlineSize;
      var contentSize = child.contentSize;

      for (var i = 0; i < 2; ++i) {
        var itemInlineSize = void 0;
        var itemContentSize = void 0;
        var containerInlineSize = void 0;
        var containerContentSize = void 0;

        if (i === 0) {
          // add item to content pos (top, bottom)
          itemInlineSize = inlineSize;
          itemContentSize = contentSize * (item.contentSize / (child.orgContentSize + item.contentSize));
          containerInlineSize = inlineSize;
          containerContentSize = contentSize - itemContentSize;
        } else {
          // add item to inline pos (left, right)
          itemContentSize = contentSize;
          itemInlineSize = inlineSize * (item.inlineSize / (child.orgInlineSize + item.inlineSize));
          containerContentSize = contentSize;
          containerInlineSize = inlineSize - itemInlineSize;
        }

        var itemSize = itemInlineSize * itemContentSize;
        var itemRatio = itemInlineSize / itemContentSize;
        var containerSize = containerInlineSize * containerContentSize;
        var containerRatio = containerContentSize / containerContentSize;
        var cost = getCost(item.getSize(), itemSize) * sizeWeight;
        cost += getCost(item.getRatio(), itemRatio) * ratioWeight;
        cost += getCost(child.getOrgSizeWeight(), containerSize) * sizeWeight - containerSizeCost;
        cost += getCost(child.getOrgRatio(), containerRatio) * ratioWeight - containerRatioCost;

        if (cost === Math.min(cost, minCost)) {
          minCost = cost;
          bestFitArea = child;
          isContentDirection = i === 0;
          itemFitSize.inlineSize = itemInlineSize;
          itemFitSize.contentSize = itemContentSize;
          containerFitSize.inlineSize = containerInlineSize;
          containerFitSize.contentSize = containerContentSize;
        }
      }
    });
    fitArea(item, bestFitArea, itemFitSize, containerFitSize, isContentDirection);
  };

  __proto._getWeight = function (type) {
    var options = this.options;
    var weightPriority = options.weightPriority;

    if (weightPriority === type) {
      return 100;
    } else if (weightPriority === "custom") {
      return options[type + "Weight"];
    }

    return 1;
  };

  PackingGrid.propertyTypes = __assign(__assign({}, Grid.propertyTypes), {
    aspectRatio: PROPERTY_TYPE.RENDER_PROPERTY,
    sizeWeight: PROPERTY_TYPE.RENDER_PROPERTY,
    ratioWeight: PROPERTY_TYPE.RENDER_PROPERTY,
    weightPriority: PROPERTY_TYPE.RENDER_PROPERTY
  });
  PackingGrid.defaultOptions = __assign(__assign({}, Grid.defaultOptions), {
    aspectRatio: 1,
    sizeWeight: 1,
    ratioWeight: 1,
    weightPriority: "custom"
  });
  PackingGrid = __decorate([GetterSetter], PackingGrid);
  return PackingGrid;
}(Grid);
/**
 * The aspect ratio (inlineSize / contentSize) of the container with items. (default: 1)
 * @ko 아이템들을 가진 컨테이너의 종횡비(inlineSize / contentSize). (default: 1)
 * @name Grid.PackingGrid#aspectRatio
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["aspectRatio"]}
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   aspectRatio: 1,
 * });
 *
 * grid.aspectRatio = 1.5;
 * ```
 */

/**
 * The priority that determines the weight of the item. (default: "custom"), "size" = (sizeWieght: 2, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 2), "custom" = (set sizeWeight, ratioWeight)
 * item's weight = item's ratio(inlineSize / contentSize) change * `ratioWeight` + size(inlineSize * contentSize) change * `sizeWeight`.
 * @ko 아이템의 가중치를 결정하는 우선수치. (default: "custom"), "size" = (sizeWieght: 2, ratioWeight: 1), "ratio" = (sizeWeight: 1, ratioWeight; 2), "custom" = (set sizeWeight, ratioWeight). 아이템의 가중치 = ratio(inlineSize / contentSize)의 변화량 * `ratioWeight` + size(inlineSize * contentSize)의 변화량 * `sizeWeight`.
 * @name Grid.PackingGrid#weightPriority
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["weightPriority"]}
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   weightPriority: "custom",
 *   sizeWeight: 1,
 *   ratioWeight: 1,
 * });
 *
 * grid.weightPriority = "size";
 * // or
 * grid.weightPriority = "ratio";
 * ```
 */

/**
 * The size weight when placing items. (default: 1)
 * @ko 아이템들을 배치하는데 사이즈 가중치. (default: 1)
 * @name Grid.PackingGrid#sizeWeight
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["sizeWeight"]}
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   sizeWeight: 1,
 * });
 *
 * grid.sizeWeight = 10;
 * ```
 */

/**
 * The weight to keep ratio when placing items. (default: 1)
 * @ko 아이템들을 배치하는데 비율을 유지하는 가중치. (default: 1)
 * @name Grid.PackingGrid#ratioWeight
 * @type {$ts:Grid.PackingGrid.PackingGridOptions["ratioWeight"]}
 * @example
 * ```js
 * import { PackingGrid } from "@egjs/grid";
 *
 * const grid = new PackingGrid(container, {
 *   ratioWeight: 1,
 * });
 *
 * grid.ratioWeight = 10;
 * ```
 */

/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */

var modules = {
    __proto__: null,
    'default': Grid,
    GetterSetter: GetterSetter,
    withGridMethods: withGridMethods,
    withMethods: withMethods,
    MasonryGrid: MasonryGrid,
    JustifiedGrid: JustifiedGrid,
    FrameGrid: FrameGrid,
    PackingGrid: PackingGrid,
    ItemRenderer: ItemRenderer,
    GridItem: GridItem,
    ContainerManager: ContainerManager,
    DEFAULT_GRID_OPTIONS: DEFAULT_GRID_OPTIONS,
    get PROPERTY_TYPE () { return PROPERTY_TYPE; },
    get MOUNT_STATE () { return MOUNT_STATE; },
    get UPDATE_STATE () { return UPDATE_STATE; },
    GRID_PROPERTY_TYPES: GRID_PROPERTY_TYPES,
    GRID_METHODS: GRID_METHODS,
    GRID_EVENTS: GRID_EVENTS,
    RECT_NAMES: RECT_NAMES
};

/**
 * egjs-grid
 * Copyright (c) 2021-present NAVER Corp.
 * MIT license
 */

for (var name in modules) {
  Grid[name] = modules[name];
}

module.exports = Grid;
//# sourceMappingURL=grid.cjs.js.map
