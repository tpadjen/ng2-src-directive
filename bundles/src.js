System.registerDynamic("src/src.directive", ["angular2/core", "angular2/http", "./sourcable", "rxjs/Observable", "rxjs/Subject", "rxjs/add/observable/empty", "rxjs/add/operator/map", "rxjs/add/operator/filter", "rxjs/add/operator/distinctUntilChanged", "rxjs/add/operator/debounceTime", "rxjs/add/operator/do", "rxjs/add/operator/retry", "rxjs/add/operator/catch", "rxjs/add/operator/switchMap"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var core_1 = $__require('angular2/core');
  var http_1 = $__require('angular2/http');
  var sourcable_1 = $__require('./sourcable');
  var Observable_1 = $__require('rxjs/Observable');
  var Subject_1 = $__require('rxjs/Subject');
  $__require('rxjs/add/observable/empty');
  $__require('rxjs/add/operator/map');
  $__require('rxjs/add/operator/filter');
  $__require('rxjs/add/operator/distinctUntilChanged');
  $__require('rxjs/add/operator/debounceTime');
  $__require('rxjs/add/operator/do');
  $__require('rxjs/add/operator/retry');
  $__require('rxjs/add/operator/catch');
  $__require('rxjs/add/operator/switchMap');
  var SrcDirective = (function() {
    function SrcDirective(_element, _viewManager, _http) {
      this._element = _element;
      this._viewManager = _viewManager;
      this._http = _http;
      this._debounceTime = 300;
      this.sourceChanged = new Subject_1.Subject();
    }
    Object.defineProperty(SrcDirective.prototype, "src", {
      set: function(source) {
        this.sourceChanged.next(source);
      },
      enumerable: true,
      configurable: true
    });
    SrcDirective.prototype.ngOnInit = function() {
      this.host = this._viewManager.getComponent(this._element);
      if (sourcable_1.implementsSourcable(this.host)) {
        this._handleSourceChanges();
      } else {
        var tagName = this._element.nativeElement.localName;
        var validSrcTags = ['img', 'script'];
        if (validSrcTags.indexOf(tagName) === -1) {
          console.warn(tagName + " has a src directive but the component does not implement the Sourcable interface.");
        }
      }
    };
    Object.defineProperty(SrcDirective.prototype, "debounceTime", {
      get: function() {
        return this._debounceTime;
      },
      set: function(time) {
        var parsed = parseInt(time, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          this._debounceTime = parsed;
        }
      },
      enumerable: true,
      configurable: true
    });
    SrcDirective.prototype._handleSourceChanges = function() {
      var _this = this;
      this._subscription = this.sourceChanged.do(function(source) {
        return _this.host.sourceChanged(source);
      }).filter(function(source) {
        return _this._emptySources(source);
      }).map(function(source) {
        return _this._addExtensionMatches(source);
      }).filter(function(req) {
        return _this._nonFiles(req);
      }).distinctUntilChanged().do(function(req) {
        return _this.host.sourceLoading(req.source);
      }).debounceTime(this.debounceTime).switchMap(function(req) {
        return _this._fetchSrc(req);
      }).catch(function(error) {
        _this.host.sourceError(error);
        console.error(error);
        return Observable_1.Observable.empty();
      }).subscribe(function(res) {
        _this.host.sourceReceived(res);
      }, function(error) {
        _this._handleResponseError(error);
      });
    };
    SrcDirective.prototype.ngOnDestroy = function() {
      this._subscription.dispose();
    };
    SrcDirective.prototype._emptySources = function(source) {
      return !(source === undefined || source == null);
    };
    SrcDirective.prototype._addExtensionMatches = function(source) {
      return {
        source: source,
        extMatches: source.match(/\.(\w+)$/)
      };
    };
    SrcDirective.prototype._nonFiles = function(req) {
      if (!req.extMatches) {
        if (req.source && req.source.length > 0) {
          this.host.sourceError({message: req.source + " is not a file."});
        } else {
          this.host.sourceError({message: "No source file given."});
        }
        return false;
      }
      return true;
    };
    SrcDirective.prototype._fetchSrc = function(req) {
      var _this = this;
      return this._http.get(req.source).catch(function(error) {
        _this.host.sourceError({message: req.source + " not found."});
        return Observable_1.Observable.empty();
      });
    };
    SrcDirective.prototype._handleResponseError = function(error) {
      console.error(error);
    };
    __decorate([core_1.Input(), __metadata('design:type', String), __metadata('design:paramtypes', [String])], SrcDirective.prototype, "src", null);
    __decorate([core_1.Input(), __metadata('design:type', Object), __metadata('design:paramtypes', [Object])], SrcDirective.prototype, "debounceTime", null);
    SrcDirective = __decorate([core_1.Directive({selector: '[src]'}), __metadata('design:paramtypes', [core_1.ElementRef, core_1.AppViewManager, http_1.Http])], SrcDirective);
    return SrcDirective;
  }());
  exports.SrcDirective = SrcDirective;
  return module.exports;
});

System.registerDynamic("src/sourcable", ["angular2/http"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var http_1 = $__require('angular2/http');
  exports.Response = http_1.Response;
  function implementsSourcable(obj) {
    return obj.sourceChanged && obj.sourceLoading && obj.sourceError && obj.sourceReceived;
  }
  exports.implementsSourcable = implementsSourcable;
  return module.exports;
});

System.registerDynamic("src", ["./src/src.directive", "./src/sourcable"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  var src_directive_1 = $__require('./src/src.directive');
  var src_directive_2 = $__require('./src/src.directive');
  exports.Source = src_directive_2.SrcDirective;
  __export($__require('./src/sourcable'));
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = {directives: [src_directive_1.SrcDirective]};
  return module.exports;
});
